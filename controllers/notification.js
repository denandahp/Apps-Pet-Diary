const debug = require('debug')('app:controller:notification');
const authUtils = require('./authUtils.js');
const notification = require('../models/notification.js');
const jwt = require('jsonwebtoken');
const config = require('../configs.json');
const jsotp = require('jsotp');
const totp = jsotp.TOTP('BASE32ENCODEDSECRET');
const maxAge = 1 * 24 * 60 * 60;
let refreshTokens = []

class notificationController {
  async showAllnotification(req, res) {
    // res.locals.edit = true;
    // let role = req.params.role;
    // let status = req.params.status;
    // let notifications = (await notification.showAllnotification(role, status)).rows;

    res.status(200).send("Hello World");

  }

  async createschedule(req, res, next) {
    let callback = async () => {
 
     try {
        let data = req.body;
        let result = await notification.createschedule(data, res);

      } catch (e) {
        console.log(e);
        let errorResponse = authUtils.processPOSTRequestError();
        res.status(400).json(errorResponse);
      }
    };

    let fallback = (err) => {
      console.log(err);
      next(err);
    }

    authUtils.processRequestWithJWT(req, callback, fallback);
  }


}
module.exports = new notificationController();