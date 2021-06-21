const debug = require('debug')('app:controller:pet');
const authUtils = require('./authUtils.js');
const pet = require('../models/pet.js');
const jwt = require('jsonwebtoken');
const config = require('../configs.json');
const jsotp = require('jsotp');
const totp = jsotp.TOTP('BASE32ENCODEDSECRET');
const maxAge = 1 * 24 * 60 * 60;
let refreshTokens = []

class petController {
  async showAllpet(req, res) {
    // res.locals.edit = true;
    // let role = req.params.role;
    // let status = req.params.status;
    // let pets = (await pet.showAllpet(role, status)).rows;

    res.status(200).send("Hello World");

  }

  async addMedcheck(req, res, next) {
    let callback = async () => {
      try {
        let datas = req.body;
        debug('detail %o', datas);
        let detail = await pet.addMedcheck(datas);
        if (detail.status == '400'){res.status(400).json({detail});}
        else {res.status(200).json({message: 'Add Medical Checkup Date Successfully!',detail});}
      } catch (e) {
        next(e.detail || e);
      }
    };
    let fallback = (err) => {
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async updateMedcheck(req, res, next) {
    let callback = async () => {
      try {
        let datas = req.body;
        debug('detail %o', datas);
        let detail = await pet.updateMedcheck(datas);
        if (detail.status == '400'){res.status(400).json({detail});}
        else {res.status(200).json({message: 'Update Medical Checkup Date Successfully!', detail});}
      } catch (e) {
        next(e.detail || e);
      }
    };
    let fallback = (err) => {
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async listMedcheck(req, res, next) {
    let callback = async () => {
      res.locals.edit = true;
      let pet_id = req.params.pet_id;
      let note_id = req.params.note_id;
      try {
        let detail = await pet.listMedcheck(pet_id, note_id);
        if (detail.status == '400'){res.status(400).json({detail});}
        else { res.status(200).json({detail});}

      } catch (e) {
        console.log(e);
        let errorResponse = authUtils.processLoginError(e);
        res.status(400).json({ errorResponse});
      }
    };
    let fallback = (err) => {
      console.log(err);
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async addnote(req, res, next) {
    let callback = async () => {
      try {
        let datas = req.body;
        debug('detail %o', datas);
        let detail = await pet.addnote(datas);
        if (detail.status == '400'){res.status(400).json({detail});}
        else {res.status(200).json({message: 'Add Note Successfully!', detail});}
      } catch (e) {
        next(e.detail || e);
      }
    };
    let fallback = (err) => {
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async updatenote(req, res, next) {
    let callback = async () => {
      try {
        let datas = req.body;
        debug('detail %o', datas);
        let detail = await pet.updatenote(datas);
        if (detail.status == '400'){res.status(400).json({detail});}
        else {res.status(200).json({message: 'Update Note Successfully!',detail});}
      } catch (e) {
        next(e.detail || e);
      }
    };
    let fallback = (err) => {
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async listnote(req, res, next) {
    let callback = async () => {
      res.locals.edit = true;
      let pet_id = req.params.pet_id;
      let note_id = req.params.note_id;
      try {
        let detail = await pet.listnote(pet_id, note_id);
        if (detail.status == '400'){res.status(400).json({detail});}
        else { res.status(200).json({detail});}

      } catch (e) {
        console.log(e);
        let errorResponse = authUtils.processLoginError(e);
        res.status(400).json({ errorResponse});
      }
    };
    let fallback = (err) => {
      console.log(err);
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

  async deletenote(req, res, next) {
    let callback = async () => {
      res.locals.edit = true;
      let note_id = req.params.note_id;
      try {
        let detail = await pet.deletenote(note_id);
        if (detail.status == '400'){res.status(400).json({detail});}
        else { res.status(200).json({message: 'Note Successfully Delete!', detail});}

      } catch (e) {
        console.log(e);
        let errorResponse = authUtils.processLoginError(e);
        res.status(400).json({ errorResponse});
      }
    };
    let fallback = (err) => {
      console.log(err);
      next(err);
    }
    authUtils.processRequestWithJWT(req, callback, fallback);
  }

}

module.exports = new petController();