const debug = require('debug')('app:controller:customerNotifjride');
const pool = require('../libs/db');
const notifbody = require('./notificationBody.js');
var admin = require("firebase-admin");

const schema = '"orders"';
const table = '"search_driver"';
const dbTable = schema + '.' + table;
const dbOrders = schema + '.' + '"orders"';


class customerNotifjrideModel{

  async orderjride_customertodriver (data, res) {
    try{
      console.log(data);
      let result = await pool.query('SELECT * FROM' + dbTable + '($1, $2);', [data.latitude_customer, data.longitude_customer]);
      console.log(result.rows[0]);
      let body = await notifbody.orderjride_customertodriver(data, result);
      //let dbdriver = await pool.query('UPDATE ' + dbOrders + ' SET (driver_id, token_driver) = ($2, $3) WHERE kode = $1 RETURNING kode, driver_id, token_driver ;', 
      //            [data.kode, result.rows[0].id, result.rows[0].token_notification]);

      await admin.messaging().send(body.payload)
          .then(function(response) {
            console.log('Successfully sent message:', response);
            res.status(200).json({
              pesan: "notifikasi terkirim mencari driver JRIDE ",
              result: response,
              driver : result.rows[0],
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

module.exports = new customerNotifjrideModel();