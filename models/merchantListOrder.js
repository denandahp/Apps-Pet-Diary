const debug = require('debug')('app:controller:merchantListOrder');
const pool = require('../libs/db');

const schema = '"orders"';
const table = '"orders"';
const dbTable = schema + '.' + table;
const dbViewjfood = schema + '.' + '"jfood"';
const dbViewjride = schema + '.' + '"jride"';


class merchantListOrderModel{

    async listorder(id_merchant) {
        try{
          let result;
          if (id_merchant === 'all') {
            result = await pool.query(' SELECT kode, status, user_id, driver_id, restaurant_id, customer_name,  jarak, estimate_minute, harga_total_merchant, status, '+
                                      'jumlah_pesanan, metode_pembayaran FROM ' + dbViewjfood + ' ORDER BY created_at ASC;')
          } else {
            result = await pool.query(' SELECT kode, status, user_id, driver_id, restaurant_id, customer_name,  jarak, estimate_minute, harga_total_merchant, status, '+
                                        'jumlah_pesanan, metode_pembayaran FROM ' + dbViewjfood + ' WHERE restaurant_id = $1 ORDER BY created_at ASC', [id_merchant])
          }
            debug('get %o', result);
            return result.rows;

        }catch(ex){
            console.log('Enek seng salah iki ' + ex);
            return "data " + ex;
        };
      }

      async detailorder(id_merchant, kode) {
        try{
            
            let res = await pool.query(' SELECT * FROM ' + dbViewjfood + ' WHERE restaurant_id = $1 AND kode = $2 ;', [id_merchant, kode])
            debug('get %o', res);
            return res.rows;

        }catch(ex){
            console.log('Enek seng salah iki ' + ex);
            return "data " + ex;
        };
      }

    async get(id) {

      let res;
      if(id == 'all'){
        res = await pool.query(' SELECT * FROM ' + dbTable + 'ORDER BY id DESC')
      }else {
        res = await pool.query(' SELECT * FROM ' + dbTable + ' where id = $1 ORDER BY id DESC', [id])
      }
      debug('get %o', res);
      return res.rows;
    }

}

module.exports = new merchantListOrderModel();