const debug = require('debug')('app:controller:driverNotiffood');
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


class driverNotiffoodModel{
    async orderfood_drivertomerchant (data, res) {
      try{
        let body = await notifbody.orderfood_drivertomerchant(data);
        
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "notifikasi Driver sedang menuju ke resto ",
                result: response,
              })
            })
            .catch(function(error) {
              console.log('Error sending message:', error);
            });
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async orderfood_drivertocustomer (data, res) {
      try{
        let body = await notifbody.orderfood_drivertocustomer(data);
        
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "notifikasi Driver sedang menuju ke resto ",
                result: response,
              })
            })
            .catch(function(error) {
              console.log('Error sending message:', error);
            });
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async processfood_drivertocustomer (data, res) {
      try{
        let body = await notifbody.processfood_drivertocustomer(data);
        console.log("notifikasi Pesanan sedang dibuat oleh resto ")
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "notifikasi Pesanan sedang dibuat oleh resto ",
                result: response,
              })
            })
            .catch(function(error) {
              console.log('Error sending message:', error);
            });
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async deliverfood_drivertocustomer (data, res) {
      try{
        let body = await notifbody.deliverfood_drivertocustomer(data);
        console.log("notifikasi Driver sedang menuju ke lokasi anda ")
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "notifikasi Driver sedang menuju ke lokasi anda ",
                result: response,
              })
            })
            .catch(function(error) {
              console.log('Error sending message:', error);
            });
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async arrivedfood_drivertocustomer (data, res) {
      try{
        let body = await notifbody.arrivedfood_drivertocustomer(data);
        
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "notifikasi Driver sudah sampai dilokasi anda ",
                result: response,
              })
            })
            .catch(function(error) {
              console.log('Error sending message:', error);
            });
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async finishedfood_drivertocustomer (data, res) {
      try{
        let body = await notifbody.finishedfood_drivertocustomer(data);
        
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "notifikasi Selamat menikmati makannnya ",
                result: response,
              })
            })
            .catch(function(error) {
              console.log('Error sending message:', error);
            });
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async finishedfood_drivertomerchant (data, res) {
      try{
        let body = await notifbody.finishedfood_drivertomerchant(data);
        let pesan = 'Driver sudah mengambil pesanannya';
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: pesan,
                result: response,
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

module.exports = new driverNotiffoodModel();