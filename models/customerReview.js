const debug = require('debug')('app:controller:customerReview');
const pool = require('../libs/db');
const notifbody = require('./notificationBody.js');

const schema = '"complaint"';
const table = '"review"';
const dbTable = schema + '.' + table;

class customerReviewModel{

    async jfooddriverreview (data) {
      try{
        var d = new Date(Date.now());;d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let sets = [data.kode, data.user_id, data.driver_id, 'true', 'jfood', data.rate_to_driver, data.comment_to_driver,d, d]
        console.log(data);
        let res = await pool.query('INSERT INTO ' + dbTable + ' (kode, user_id, driver_id, finished_review_driver, service, rate_to_driver, comment_to_driver, time_comment_driver, created_at)' + 
                                  ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', sets);
        debug('update %o', res);
        let result = res.rows[0];
        return result;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async jfoodmerchantreview (data) {
        try{
            var d = new Date(Date.now());;d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
            let sets = [data.kode, data.user_id, data.restaurant_id, 'true', data.service, data.rate_to_restaurant, data.comment_to_restaurant, d]
            console.log(data);
            let res = await pool.query('UPDATE ' + dbTable + ' SET (kode, user_id, restaurant_id, finished_review_restaurant, service, rate_to_restaurant, comment_to_restaurant, time_comment_restaurant)' + 
                                      ' = ($1, $2, $3, $4, $5, $6, $7, $8) WHERE kode = $1 AND user_id = $2 RETURNING *;', sets);
            debug('update %o', res);
            let result = res.rows[0];
            return result;
          }catch(ex){
            console.log('Enek seng salah iki ' + ex)
          };
    }

    async jridedriverreview (data) {
      try{
        var d = new Date(Date.now());;d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let sets = [data.kode, data.user_id, data.driver_id, 'true', 'jride', data.rate_to_driver, data.comment_to_driver,d, d]
        console.log(data);
        let res = await pool.query('INSERT INTO ' + dbTable + ' (kode, user_id, driver_id, finished_review_driver, service, rate_to_driver, comment_to_driver, time_comment_driver, created_at)' + 
                                  ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, kode, user_id, driver_id, finished_review_driver, service, rate_to_driver, comment_to_driver, time_comment_driver, created_at', sets);
        debug('update %o', res);
        let result = res.rows[0];
        return result;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

}

module.exports = new customerReviewModel();