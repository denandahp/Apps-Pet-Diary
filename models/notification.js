const debug = require('debug')('app:controller:notification');
const pool = require('../libs/db');
const notifbody = require('./notificationBody.js');
const admin = require("../config/firebase_config.js");
const scheduleLib = require("node-schedule");


const schema = '"pets"';
const table = '"schedule_notification"';
const dbTable = schema + '.' + table;


class notificationModel{  
    async createschedule (data, res) {
      try{
        let res; var d = new Date(Date.now());d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let value = [data.uid, data.note_id, data.time, data.days, data.notification_title, data.notification_body, d];
        res = await pool.query('INSERT INTO ' + dbTable + ' (uid_user, note_id, time, days, notification_title, notification_body, created_at)'+
                               ' VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', value);
        
        //Format for time "October 13, 2014 11:13:00"
        const date = new Date(`${data.days} ${data.time}`);
        let body = await notifbody.createschedule(data);
        
        scheduleLib.scheduleJob(date, function (){
            admin.messaging().sendMulticast(body.payload)
            .then(function(response) {
              console.log('Successfully sent message:', response);
              res.status(200).json({
                pesan: "notifikasi Pesanan ditolak oleh merchant ",
                result: response,
              })
            })
            .catch(function(error) {
              res.status(400).json('Error sending message:' + error)
              console.log('Error sending message:', error);
            });
        });
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
        res.status(400).json('error:' + ex)
      };
    }

}





module.exports = new notificationModel();