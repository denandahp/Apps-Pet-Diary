const Router = require('express').Router();
const auth = require('../middleware/auth.js');
const notification = require('../controllers/notification.js');


Router.post('/schedule/create', notification.createschedule)


module.exports = Router;