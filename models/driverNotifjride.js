const debug = require('debug')('app:controller:driverNotifjride');
const pool = require('../libs/db');
const notifbody = require('./notificationBody.js');
var admin = require("firebase-admin");
var serviceAccount = require('../private_key_firebase.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const schema = '"orders"';
const table = '"search_driver"';
const dbTable = schema + '.' + table;


class driverNotifjrideModel{
    async acceptjride_drivertocustomer (data, res) {
      try{
        let body = await notifbody.acceptjride_drivertocustomer(data);
        
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "notifikasi Driver sedang menuju ke lokasi customer",
                result: response,
                data: data
              })
            })
            .catch(function(error) {
              console.log('Error sending message:', error);
            });
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async deliverjride_drivertocustomer (data, res) {
      try{
        let body = await notifbody.deliverjride_drivertocustomer(data);
        
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "notifikasi Driver mengantar customer ke tujuan ",
                result: response,
                data: data
              })
            })
            .catch(function(error) {
              console.log('Error sending message:', error);
            });
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async finishedjride_drivertocustomer (data, res) {
      try{
        let body = await notifbody.finishedjride_drivertocustomer(data);
        console.log("Driver sudah sampai ditujuan customer ")
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "notifikasi Driver sudah sampai ditujuan customer ",
                result: response,
                data: data
              })
            })
            .catch(function(error) {
              console.log('Error sending message:', error);
            });
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }


}

module.exports = new driverNotifjrideModel();