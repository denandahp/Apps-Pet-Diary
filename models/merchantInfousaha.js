const debug = require('debug')('app:controller:merchantInfousaha');
const pool = require('../libs/db');

const schema = '"merchant"';
const table = '"restaurant"';
const dbTable = schema + '.' + table;
const dbinfopendapatan = schema + '.infopendapatan'

class merchantInfousahaModel{
    async register (data) {
      try{

        var d = new Date(Date.now());
        d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let value =  [ data.user_id, data.name, data.penjualan_per_tahun, 
                      data.penjualan_per_hari, data.latitude, data.longitude, data.address, data.province, 
                      data.city, data.patokan, d, d, data.state_informasi_usaha]
        let res = await pool.query('INSERT INTO ' + dbTable + ' (user_id, name,' +
                                  'penjualan_per_tahun, penjualan_per_hari, latitude, longitude, address, province,'+
                                  'city, patokan, created_at, updated_at, state_informasi_usaha) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;', value);
        debug('register %o', res);
    
        return res;

        }catch(ex){
          console.log('Enek seng salah iki ' + ex)
        };
      }

    async update (data) {
      try{
        var d = new Date(Date.now());
        d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let sets = [ data.user_id, data.name, data.penjualan_per_tahun, 
                     data.penjualan_per_hari, data.latitude, data.longitude, data.address, data.province, 
                     data.city, data.patokan, d, data.state_informasi_usaha]
        let res = await pool.query('UPDATE' + dbTable + 'SET (name,' +
                     'penjualan_per_tahun, penjualan_per_hari, latitude, longitude, address, province,'+
                     'city, patokan, updated_at, state_informasi_usaha) = ($2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)' +
                     'WHERE user_id = $1 RETURNING *', sets);
        debug('update %o', res);
        let result = res.rows[0];
        return result;

      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async get(user_id) {

      let res;
      if(user_id == 'all'){
        res = await pool.query(' SELECT * FROM ' + dbTable + 'ORDER BY user_id DESC')
      }else {
        res = await pool.query(' SELECT * FROM ' + dbTable + ' where user_id = $1 ORDER BY user_id DESC', [user_id])
      }
      
      debug('get %o', res);

      return res.rows;

    }

    async pendapatan(peroption){
      try{
        let res;
        if (peroption == 'perhari'){res = await pool.query(' SELECT pendapatan_perhari FROM ' + dbinfopendapatan + ' ORDER BY infopendapatan_id DESC')}
        else if (peroption == 'perminggu'){res = await pool.query(' SELECT pendapatan_perminggu FROM ' + dbinfopendapatan + ' ORDER BY infopendapatan_id DESC')}
        else if (peroption == 'perbulan'){res = await pool.query(' SELECT pendapatan_perbulan FROM ' + dbinfopendapatan + ' ORDER BY infopendapatan_id DESC')}
        else if (peroption == 'pertahun'){res = await pool.query(' SELECT pendapatan_pertahun FROM ' + dbinfopendapatan + ' ORDER BY infopendapatan_id DESC')}
        else{res = await pool.query(' SELECT * FROM ' + dbinfopendapatan + 'ORDER BY infopendapatan_id DESC')}
        
        debug('get %o', res);

        return res.rows;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

}

module.exports = new merchantInfousahaModel();