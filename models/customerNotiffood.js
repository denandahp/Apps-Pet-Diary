const debug = require('debug')('app:controller:customerNotiffood');
const pool = require('../libs/db');
const notifbody = require('./notificationBody.js');
var admin = require("firebase-admin");

const schema = '"orders"';
const table = '"search_driver"';
const dbTable = schema + '.' + table;

class customerNotiffoodModel{
    async orderfoodtodriver (data, res) {
      try{
        let result = await pool.query('SELECT * FROM' + dbTable + '($1, $2);', [data.latitude, data.longitude]);
        console.log(result.rows[0]);
        let body = await notifbody.orderfoodtodriver(data,result);
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "notifikasi terkirim",
                respone : response,
                result: data,
                driver: result.rows[0]
              })
            })
            .catch(function(error) {
              console.log('Error sending message:', error);
            });
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async orderfood_customertomerchant (data, res) {
      try{
        let body = await notifbody.orderfood_customertomerchant(data);
        
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "Notifikasi Pesanan JFOOD dibuat atas nama " + data.name,
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

    async rejectedfood_customertomerchant (data, res) {
      try{
        let body = await notifbody.rejectedfood_customertomerchant(data);
        
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: 'Pesanan JFOOD dibatalkan oleh ' + data.name + " dengan alasan " + data.reason_customer_rejected,
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

module.exports = new customerNotiffoodModel();