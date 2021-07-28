const debug = require('debug')('app:server');
const session = require('cookie-session');
const express = require('express');
const morgan = require('morgan');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const CONFIG_FILE_PATH = __dirname + '/configs.json';
const config = require(CONFIG_FILE_PATH);
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const admin = require('./config/firebase_config.js')
const dotenv = require('dotenv');

//Sentry tracking
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

Sentry.init({
  dsn: "https://e050249671f741d199d97e2d9f7ebcbd@o911947.ingest.sentry.io/5848527",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});


dotenv.config();
     
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');


const PORT = process.env.PORT || 3000;
console.log(`Your ports is ${PORT}`);

server.listen(PORT, () => {
  debug('Server Started. *:%o', PORT);
});

// Views setting
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Body Parser
app.use(morgan('tiny'));
app.use(logger('dev'));
app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//Limit JSON
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: true,
  parameterLimit: 50000
}));

//Static image
app.use(express.static(path.join(__dirname, 'uploads')));

//Simple Usage (Enable All CORS Requests)
app.use(cors())
// app.get('/products/:id', function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for all origins!'})
// })
// app.listen(80, function () {
//   console.log('CORS-enabled web server listening on port 80')
// })

// cookie-session
app.set('trust proxy', 1); // trust first proxy

app.use(session(config.cookies));

// MaxAge
app.use(function SessionMaxAgeMiddleware(req, res, next) {
  req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge;
  next();
});

// locals.
app.use(function LocalsMiddleware(req, res, next) {

  res.locals.edit = false;
  res.locals.user = req.session.user || false;

  next();
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// All controllers should live here
app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

const index = require('./routes/index.js');
const user = require('./routes/user.js');
const pet = require('./routes/pet.js');
const news = require('./routes/contentfull.js')
const notification = require('./routes/notification.js');

app.use('/', index);
app.use('/api/user', user);
app.use('/api/pet', pet);
app.use('/api/news', news)
app.use('/api/notification', notification);


// Error Middleware
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});


app.use(require('./libs/error.js'));