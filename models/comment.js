const debug = require('debug')('app:controller:comment');
const pool = require('../libs/db');

const schema = '"public"';
const table = '"comment"';
const dbTable = schema + '.' + table;

class commentModel{
    async add (data) {
        let value =  [ data.username, data.comment_text,data.comment_rate, data.comment_date, data.comment_lastdate]
        console.log(value);
        let res = await pool.query('INSERT INTO ' + dbTable + ' (username, comment_text, comment_rate, comment_date, comment_lastdate) VALUES ($1, $2, $3, $4, $5) RETURNING *;', value);
        debug('add %o', res);
    
        return res;
      }

    async update (data) {

        let sets =[data.comment_id, data.username, data.comment_text, data.comment_rate, data.comment_lastdate]
        let res = await pool.query('UPDATE ' + dbTable + 'SET (username, comment_text,comment_rate, comment_lastdate)  = ($2, $3, $4, $5) WHERE comment_id = $1', sets);
        debug('update %o', res);
        return res;
    }

    async get(comment_id) {

        let res;
         res = await pool.query(' SELECT * FROM ' + dbTable + ' where comment_id = $1 ORDER BY comment_id DESC', [comment_id])
        debug('get %o', res);
    
        return res.rows;
    
      }


}

module.exports = new commentModel();