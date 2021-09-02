const Router = require('express').Router();
const auth = require('../middleware/auth.js');
const user = require('../controllers/user.js');


Router.post('/signup', user.signup)
    .post('/registerfirebase', auth, user.register)
    .put('/update/profile', auth, user.updateprofile)
    .get('/profile/:uid', user.getprofile)
    .get('/signup/checkdata/:uid', user.checkdatauser)


module.exports = Router;