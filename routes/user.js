const Router = require('express').Router();
const auth = require('../middleware/auth.js');
const user = require('../controllers/user.js');


Router.post('/signup', auth, user.signup)
      .post('/registerfirebase',  user.register)
      .put('/update/profile', auth, user.updateprofile)
      .get('/profile/:uid', auth, user.getprofile)
      .get('/signup/checkdata/:uid', user.checkdatauser)


module.exports = Router;