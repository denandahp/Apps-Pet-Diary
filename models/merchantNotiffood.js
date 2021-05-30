const debug = require('debug')('app:controller:merchantNotiffood');
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
const dbOrders = schema + '.' + '"orders"';


class merchantNotiffoodModel{
    async orderfood_merchanttodriver (data, res) {
      try{
        console.log(data);
        let result = await pool.query('SELECT * FROM' + dbTable + '($1, $2);', [data.latitude_merchant, data.longitude_merchant]);
        console.log(result.rows[0]);
        let body = await notifbody.orderfood_merchanttodriver(data, result);
        let dbdriver = await pool.query('UPDATE ' + dbOrders + ' SET (driver_id, token_driver) = ($2, $3) WHERE kode = $1 RETURNING kode, driver_id, token_driver ;', 
                    [data.kode, result.rows[0].id, result.rows[0].token_notification]);

        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "notifikasi terkirim mencari driver ",
                result: response,
                driver : result.rows[0]
              })
            })
            .catch(function(error) {
              console.log('Error sending message:', error);
            });
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }
    
    async rejectedfood_merchanttocustomer (data, res) {
      try{
        console.log(data);
        let body = await notifbody.rejectedfood_merchanttocustomer(data);
        
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "notifikasi Pesanan ditolak oleh merchant ",
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

    async processfood_merchanttodriver (data, res) {
      try{
        console.log(data);
        let body = await notifbody.processfood_merchanttodriver(data);
        
        await admin.messaging().send(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "Driver bisa mengambil pesanannya",
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

module.exports = new merchantNotiffoodModel();