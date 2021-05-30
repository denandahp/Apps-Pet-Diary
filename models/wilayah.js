const debug = require('debug')('app:controller:wilayah');
const pool = require('../libs/db');

const schema = '"wilayah"';
const table = '"wilayah_2020"';
const dbTable = schema + '.' + table;

class wilayahModel{
    async provinsi() {
        let res;
         res = await pool.query(' SELECT * FROM ' + dbTable + ' WHERE kode LIKE left(kode, 2) LIMIT 35')
        debug('get %o', res);
    
        return res.rows;
    
      }
    
    async kab_kota(kodeprov) {
        let res;
         res = await pool.query(' SELECT DISTINCT kode, nama FROM ' + dbTable + ' WHERE length(kode)>3 AND length(kode)<8 AND left(kode,2) =$1 ;', [kodeprov])
        debug('get %o', res);
    
        return res.rows;
      }

    async kecamatan(kodeprov) {
        let res;
         res = await pool.query(' SELECT DISTINCT kode, nama FROM ' + dbTable + ' WHERE length(kode)>6 AND length(kode)<9 AND left(kode,2) =$1 ;', [kodeprov])
        debug('get %o', res);
    
        return res.rows;
      }

      async kelurahan(kodeprov) {
        let res;
         res = await pool.query(' SELECT DISTINCT kode, nama FROM ' + dbTable + ' WHERE length(kode)>9 AND left(kode,2) =$1 ;', [kodeprov])
        debug('get %o', res);
    
        return res.rows;
      }


}

module.exports = new wilayahModel();