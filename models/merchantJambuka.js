const debug = require('debug')('app:controller:merchantJambuka');
const pool = require('../libs/db');

const schema = '"merchant"';
const table = '"restaurant"';
const dbTable = schema + '.' + table;

class merchantJambukaModel{
    async register (data) {
      try{
        var d = new Date(Date.now());
        d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let value =  [data.user_id, data.is_open_ , data.open_time_, data.close_time_, d]
        let res = await pool.query('UPDATE ' + dbTable + 'SET (is_open_' + data.day + ', open_time_'+ data.day +', close_time_'+ data.day +', updated_at) = ($2, $3, $4, $5) WHERE user_id = $1 RETURNING user_id, name, is_open_' + data.day + ', open_time_'+ data.day +', close_time_'+ data.day +', updated_at;', value);
        let uploadJson = await pool.query('UPDATE ' + dbTable + ' SET state_informasi_merchant = state_informasi_merchant  || \'{"jam_operasional":"varified"}\' WHERE user_id = $1 RETURNING state_informasi_merchant;',[data.user_id]);
        debug('register %o', res);
        return {"data" : res.rows[0], "state" : uploadJson.rows[0]};

      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async update (data) {
      try{
        var d = new Date(Date.now());
        d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
          let sets = [data.user_id, data.is_open_ + data.day , data.open_time_ + data.day, data.close_time_ + data.day, d]
          let res = await pool.query('UPDATE ' + dbTable + 'SET (is_open_' + data.day + ', open_time_'+ data.day +', close_time_'+ data.day +', updated_at) = ($2, $3, $4, $5) WHERE user_id = $1 RETURNING user_id, name, is_close, is_open_' + data.day + ', open_time_'+ data.day +', close_time_'+ data.day +', updated_at;', sets);
        debug('update %o', res);
        let result = res.rows[0];
        return result;
        
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async closedresto (data) {
      try{
        var d = new Date(Date.now());
        d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
          let sets = [data.user_id, data.is_close, d]
          let res = await pool.query('UPDATE ' + dbTable + 'SET (is_close ,updated_at) = ($2, $3) WHERE user_id = $1 RETURNING user_id, name, is_close, updated_at;', sets);
        debug('update %o', res);
        let result = res.rows[0];
        return result;
        
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async get(user_id) {
      try{
        let res;
        if(user_id == 'all'){
          res = await pool.query(' SELECT * FROM ' + dbTable + 'ORDER BY user_id DESC')
        }else {
          res = await pool.query(' SELECT id, user_id, is_close, is_open_sunday, open_time_sunday, close_time_sunday, is_open_monday, open_time_monday, close_time_monday, is_open_tuesday, open_time_tuesday, close_time_tuesday ,' 
                                +' is_open_wednesday, open_time_wednesday, close_time_wednesday, is_open_thursday, open_time_thursday, close_time_thursday, is_open_friday, open_time_friday, close_time_friday ,'
                                +' is_open_saturday, open_time_saturday, close_time_saturday FROM ' + dbTable + ' WHERE user_id = $1 ORDER BY user_id ASC;', [user_id]);
                              }
        

        debug('get %o', res);
        return res.rows;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }
    
    async stateJambuka(user_id) {

      let res;
      res = await pool.query(' SELECT id, user_id, state_informasi_merchant FROM ' + dbTable + ' WHERE user_id =$1 ORDER BY id ASC', [user_id])
        debug('get %o', res);
        return {"id" : res.rows[0].id,"user_id" : res.rows[0].user_id, "data" : res.rows[0].state_informasi_merchant.jam_operasional}

    }

}

module.exports = new merchantJambukaModel();