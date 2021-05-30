const Router = require('express').Router();
const auth = require('../middleware/auth.js');
const user = require('../controllers/user.js');
const home = require('../controllers/driverHomealt.js');

Router.post('/login', user.login)
      .post('/renewAccessToken', user.renewAccessToken)
      .post('/register', user.register)
      .post('/register/registerlanjut', user.registerlanjut)
      .post('/register/verifikasiotp', user.verifikasiotp)
      .post('/register/resendotp', user.resendotp)
      .post('/verifikasiUser', user.verifikasiUser)
      .post('/searchingdata', user.searchingdata)
      .post('/delete', user.delete)
      .post('/edit', user.edit)
      .get('/detail/:id', user.detail)
      .get('/userstatus/:id', user.userstatus)
      .post('/logout', user.logout)
      .delete('/logout', user.logout)
      .get('/alluser/:role/:status', user.showAllUser)
      .get('/alluserbyschedule/:username', user.userbyschedule)
      .put('/isactive', auth, home.is_active)
      .put('/active', auth, home.active)
      .put('/nonactive', auth, home.nonactive)
      .put('/autobid', auth, home.autobid)
      .put('/activeautobid', auth, home.activeautobid)
      .put('/nonactiveautobid', auth, home.nonactiveautobid)
      .get('/homealt', auth, home.homealt)
      .post('/history', auth, home.history)
      .get('/detailhistory/:kode', auth, home.detailhistory)

module.exports = Router;