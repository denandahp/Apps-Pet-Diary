const debug = require('debug')('app:controller:user');
const authUtils = require('./authUtils.js');
const user = require('../models/user.js');
const jsotp = require('jsotp');
const totp = jsotp.TOTP('BASE32ENCODEDSECRET');


class UserController {
  async showAllUser(req, res) {
    // res.locals.edit = true;
    // let role = req.params.role;
    // let status = req.params.status;
    // let users = (await user.showAllUser(role, status)).rows;

    res.status(200).send("Hello World");

  }

  async signup(req, res, next) {
    let callback = async () => {
      try {
        let datas = req.body;
        debug('detail %o', datas);
        let checkdatauser = await user.checkdatauser(datas);
        if(checkdatauser.status == '200'){
          res.status(200).json({
            message: "UID Sudah Terdaftar!",
            status : checkdatauser.errors
          });
        }
        else {
          let detail = await user.signup(datas);
          if (detail.status == '400'){
            res.status(400).json({
              detail
            });
          }else {
            res.status(200).json({
              message: "UID Baru Telah diDaftarkan!",
              detail
            });
          }
        }
      } catch (e) {
        next(e.detail || e);
      }
    };
    let fallback = (err) => {
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async updateprofile(req, res, next) {
    let callback = async () => {
      try {
        let datas = req.body;
        debug('detail %o', datas);
        let detail = await user.updateprofile(datas);
        if (detail.status == '400'){res.status(400).json({detail });
        }else {res.status(200).json({detail });
        }

      } catch (e) {
        next(e.detail || e);
      }
    };
    let fallback = (err) => {
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async getprofile(req, res, next) {
    let callback = async () => {
      res.locals.edit = true;
      let uid = req.params.uid;
      try {
        let detail = await user.getprofile(uid);
       
        if (detail.status == '400'){res.status(400).json({detail});}
        else { res.status(200).json({detail});}

      } catch (e) {
        console.log(e);
        let errorResponse = authUtils.processLoginError(e);
        res.status(400).json({
          errorResponse
        });
      }
    };
    let fallback = (err) => {
    
      console.log(err);
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async checkdatauser(req, res, next) {
    let callback = async () => {
      res.locals.edit = true;
      let uid = req.params.uid;
      try {
        let detail = await user.checkdatauser(uid);
        res.status(200).json({detail});

      } catch (e) {
        console.log(e);
        let errorResponse = authUtils.processLoginError(e);
        res.status(400).json({
          errorResponse
        });
      }
    };
    let fallback = (err) => {
      console.log(err);
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async register(req, res, next) {
    let callback = async () => {
      try {
        let datas = req.body;
        debug('detail %o', datas);
        let detail = await user.register(datas);
        if (detail.status == '400'){
          res.status(400).json({
            detail
          });
        }else {
          res.status(200).json({
            detail
          });
        }

      } catch (e) {
        next(e.detail || e);
      }
    };
    let fallback = (err) => {
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async addpet(req, res, next) {
    let callback = async () => {
      try {
        let datas = req.body;
        debug('detail %o', datas);
        let detail = await user.addpet(datas);

        if (detail.status == '400'){
          res.status(400).json({
            detail
          });
        }else {
          res.status(200).json({
            detail
          });
        }
      } catch (e) {
        next(e.detail || e);
      }
    };
    let fallback = (err) => {
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async profilepet(req, res, next) {
    let callback = async () => {
      res.locals.edit = true;
      let pet_id = req.params.pet_id;
      try {
        let detail = await user.profilepet(pet_id);
        if (detail.status == '400'){res.status(400).json({detail});}
        else { res.status(200).json({detail});}

      } catch (e) {
        console.log(e);
        let errorResponse = authUtils.processLoginError(e);
        res.status(400).json({
          errorResponse
        });
      }
    };
    let fallback = (err) => {
      console.log(err);
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async updateprofilpet(req, res, next) {
    let callback = async () => {
      let datas = req.body;
      try {
        let detail = await user.updateprofilpet(datas);
        if (detail.status == '400'){res.status(400).json({detail});}
        else { res.status(200).json({detail});}

      } catch (e) {
        console.log(e);
        let errorResponse = authUtils.processLoginError(e);
        res.status(400).json({
          errorResponse
        });
      }
    };
    let fallback = (err) => {
      console.log(err);
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async deleteprofilpet(req, res, next) {
    let callback = async () => {
      res.locals.edit = true;
      let pet_id = req.params.pet_id;
      try {
        let detail = await user.deleteprofilpet(pet_id);
        if (detail.status == '400'){res.status(400).json({detail});}
        else { res.status(200).json({detail});}

      } catch (e) {
        console.log(e);
        let errorResponse = authUtils.processLoginError(e);
        res.status(400).json({
          errorResponse
        });
      }
    };
    let fallback = (err) => {
      console.log(err);
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async listpet(req, res, next) {
    let callback = async () => {
      res.locals.edit = true;
      let uid = req.params.uid;
      try {
        let detail = await user.listpet(uid);
        if (detail.status == '400'){res.status(400).json({detail});}
        else { res.status(200).json({detail});}

      } catch (e) {
        console.log(e);
        let errorResponse = authUtils.processLoginError(e);
        res.status(400).json({
          errorResponse
        });
      }
    };
    let fallback = (err) => {
      console.log(err);
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }


}

module.exports = new UserController();