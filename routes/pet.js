const Router = require('express').Router();
const auth = require('../middleware/auth.js');
const user = require('../controllers/user.js');
const pet = require('../controllers/pet.js');


Router.post('/addpet', auth, user.addpet)
      .post('/add/note', auth, pet.addnote) 
      .post('/add/checkupdate', auth, pet.addMedcheck)
      .put('/update/note', auth, pet.updatenote)
      .put('/update/checkupdate', auth, pet.updateMedcheck)
      .put('/profil/updatepet', auth, user.updateprofilpet)
      .get('/list/note/:pet_id/:note_id', auth, pet.listnote)
      .get('/list/checkupdate/:pet_id/:note_id', auth, pet.listMedcheck)
      .get('/list/:uid', auth, user.listpet)
      .get('/profil/:pet_id', auth, user.profilepet)
      .delete('/delete/note/:note_id', auth,  pet.deletenote)
      .delete('/profil/deletepet/:pet_id', auth, user.deleteprofilpet)
      


module.exports = Router;