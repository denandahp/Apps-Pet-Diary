const debug = require('debug')('app:controller:merchantOrder');
const pool = require('../libs/db');

const schema = '"orders"';
const table = '"jfood"';
const dbTable = schema + '.' + table;
const dbOrders = schema + '.' + '"orders"' ;
const dbDriver = 'public.users';


class merchantOrderModel{

  async opsistatus (data) {
    try{
      var d = new Date(Date.now());d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
      let value =  [ data.kode, data.restaurant_id, "Merchant Menerima Pesanan", data.total_price_merchant, "Accepted", d];
      let res = await pool.query('UPDATE ' + dbOrders + ' SET (merchant_id, status, total_price_merchant, status_paid_merchant, updated_at)'+
                ' = ($2, $3, $4, $5, $6) WHERE kode = $1 RETURNING kode, merchant_id, status, total_price_merchant, status_paid_merchant, updated_at;', value);
      debug('register %o', res);
  
      return res;
    }catch(ex){
      console.log('Enek seng salah iki ' + ex)
    };
  }

  async orderready (data) {
    try{
      var verifcode = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
      var d = new Date(Date.now());d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
      let value =  [ data.kode, data.restaurant_id, "Merchant Pesanan Sudah Siap", data.total_price_merchant, "Paid", d, verifcode];
      let res = await pool.query('UPDATE ' + dbOrders + ' SET (merchant_id, status, total_price_merchant, status_paid_merchant, updated_at, driver_verification_code)'+
                ' = ($2, $3, $4, $5, $6, $7) WHERE kode = $1 RETURNING kode, merchant_id, status, total_price_merchant, status_paid_merchant, updated_at, driver_verification_code;', value);
      debug('register %o', res);
  
      return res;
    }catch(ex){
      console.log('Enek seng salah iki ' + ex)
    };
  }

  async rejectorder (data) {
    try{
      var d = new Date(Date.now());d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
      let value =  [ data.kode, data.restaurant_id, "Merchant Menolak Pesanan", data.reason_merchant_rejected, "Rejected", d, d];
      let res = await pool.query('UPDATE ' + dbOrders + ' SET (merchant_id, status, reason_merchant_rejected, status_paid_merchant, time_merchant_rejected, updated_at)'+
                ' = ($2, $3, $4, $5, $6, $7) WHERE kode = $1 RETURNING kode, merchant_id ,status, reason_merchant_rejected, status_paid_merchant, time_merchant_rejected, updated_at;', value);
      debug('register %o', res);
  
      return res;
    }catch(ex){
      console.log('Enek seng salah iki ' + ex)
    };
  }

    async pesananmasuk(kode){
      try{
        let result = {};
        let status = await pool.query('SELECT kode, status, customer_id, merchant_id, landmark_pickup, address_pickup, patokan_pickup, landmark_destination, address_destination, patokan_destination, latitude_location_destination, '+
        'longitude_location_destination, token_customer, token_driver FROM ' + dbOrders + ' WHERE kode = $1 ORDER BY customer_id ASC;', [kode]);
        let res = await pool.query(' SELECT kode, user_id, customer_name, harga_total_merchant, jumlah_menu, menu_id, menu_name,'+
            ' menu_price_merchant, menu_quantity, menu_catatan FROM ' + dbTable + ' WHERE kode = $1 ORDER BY menu_id ASC',[kode])
        result.status = status.rows;result.data = res.rows;
        debug('get %o', result);

        return result;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async transaksiorder(kode){
      try{
        let res;
        res = await pool.query(' SELECT kode, user_id, customer_name, harga_total_merchant, jumlah_menu, menu_id, menu_name,'+
            ' menu_price_merchant, menu_quantity, menu_catatan FROM ' + dbTable + ' ORDER BY menu_id ASC')
        
        debug('get %o', res);

        return res.rows;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async datadriver(id_driver){
      try{
        let status = await pool.query('SELECT id, username, namadepan, namabelakang, photo, phone, token_notification, latitude_position, longitude_position FROM ' + dbDriver + ' WHERE id = $1;', [id_driver]);
        
        debug('get %o', status.rows[0]);

        return status.rows[0];
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

}

module.exports = new merchantOrderModel();