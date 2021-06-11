const Router = require('express').Router();
const auth = require('../middleware/auth.js');
const user = require('../controllers/user.js');


Router.post('/signup',  user.signup)
      .post('/registerfirebase',  user.register)
      .post('/addpet', auth, user.addpet)
      .get('/profil/pet/:pet_id', auth, user.profilepet)
      .put('/profil/updatepet', auth, user.updateprofilpet)
      .delete('/profil/deletepet/:pet_id', auth, user.deleteprofilpet)
      .get('/list/pet/:uid', auth, user.listpet)


module.exports = Router;