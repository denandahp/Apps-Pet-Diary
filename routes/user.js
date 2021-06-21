const Router = require('express').Router();
const auth = require('../middleware/auth.js');
const user = require('../controllers/user.js');


Router.post('/signup',  user.signup)
      .post('/registerfirebase',  user.register)


module.exports = Router;