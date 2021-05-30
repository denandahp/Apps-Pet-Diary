const debug = require('debug')('app:controller:atribut');
const pool = require('../libs/db');

const schema = '"public"';
const table = '"atribut"';
const dbTable = schema + '.' + table;

class atributModel{
    async register (data) {
        var d = new Date(Date.now());
        let value =  [ data.username, data.atribut_helm, data.atribut_jaket, data.atribut_masker, data.atribut_atributlain, d, d]
        let res = await pool.query('INSERT INTO ' + dbTable + ' (username, atribut_helm, atribut_jaket, atribut_masker, atribut_atributlain, atribut_date, atribut_lastdate) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', value);
        debug('register %o', res);
    
        return res;
      }

    async update (data) {
        var d = new Date(Date.now());
        let sets =[data.atribut_id, data.username, data.atribut_helm, data.atribut_jaket, data.atribut_masker, data.atribut_atributlain, d]
        let res = await pool.query('UPDATE ' + dbTable + 'SET (username, atribut_helm, atribut_jaket, atribut_masker, atribut_atributlain, atribut_lastdate)  = ($2, $3, $4, $5, $6, $7) WHERE atribut_id = $1 RETURNING username, atribut_lastdate;', sets);
        debug('update %o', res);
        let result = res.rows[0];
        return result;
    }

    async get(username) {     
        let res;
        res = await pool.query(' SELECT * FROM ' + dbTable + ' where username = $1 ORDER BY username DESC', [username])
        debug('get %o', res);
        if (res.rowCount <= 0) {
            return 'Atribut belum terdaftar';
          } else {
            return res.rows;
          }
      }

}

module.exports = new atributModel();