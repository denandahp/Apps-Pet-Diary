const debug = require('debug')('app:controller:warning');
const pool = require('../libs/db');

const schema = '"public"';
const table = '"warning"';
const dbTable = schema + '.' + table;

class warningModel{
    async add (data) {
        let value =  [ data.username, data.warning_name, data.warning_desc, data.warning_date, data.warning_lastdate]
        console.log(value);
        let res = await pool.query('INSERT INTO ' + dbTable + ' (username, warning_name, warning_desc, warning_date, warning_lastdate) VALUES ($1, $2, $3, $4, $5) RETURNING *;', value);
        debug('add %o', res);
    
        return res;
      }

    async update (data) {

        let sets =[data.warning_id, data.username, data.warning_name, data.warning_desc, data.warning_lastdate]
        let res = await pool.query('UPDATE ' + dbTable + 'SET (username, warning_name,warning_desc, warning_lastdate)  = ($2, $3, $4, $5) WHERE warning_id = $1', sets);
        debug('update %o', res);
        return res;
    }

    async get(warning_id) {

        let res;
         res = await pool.query(' SELECT * FROM ' + dbTable + ' where warning_id = $1 ORDER BY warning_id DESC', [warning_id])
        debug('get %o', res);
    
        return res.rows;
    
      }


}

module.exports = new warningModel();