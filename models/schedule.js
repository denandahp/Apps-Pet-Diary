const debug = require('debug')('app:controller:schedule');
const pool = require('../libs/db');

const schema = '"public"';
const table = '"schedule"';
const dbTable = schema + '.' + table;

class scheduleModel{
    async register (data) {
      let value =  [ data.username, data.schedule_name, data.schedule_start, data.schedule_end , data.schedule_date]
      console.log(value);
      let res = await pool.query('INSERT INTO ' + dbTable + ' (username, schedule_name, schedule_start, schedule_end, schedule_date) VALUES ($1, $2, $3, $4, $5) RETURNING *;', value);
      debug('register %o', res);

      return res;
    }

  async update (data) {

      let sets =[ data.username, data.schedule_name, data.schedule_start, data.schedule_end ,data.schedule_date]
      let res = await pool.query('UPDATE ' + dbTable + 'SET (schedule_name, schedule_start, schedule_end, schedule_date) = ($2, $3, $4, $5) WHERE username = $1 RETURNING *;', sets);
      debug('update %o', res);
      let result = res.rows[0];
      return result;
  }

  async get(username) {

      let res;

      if(username == 'all'){
        res = await pool.query(' SELECT * FROM ' + dbTable + 'ORDER BY username DESC')
      }else {
        res = await pool.query(' SELECT * FROM ' + dbTable + ' where username = $1 ORDER BY username DESC', [username])
      }
      
      debug('get %o', res);

      return res.rows;

    }


}

module.exports = new scheduleModel();