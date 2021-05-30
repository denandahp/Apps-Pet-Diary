const debug = require('debug')('app:controller:customerPayment');
const pool = require('../libs/db');
const notifbody = require('./notificationBody.js');

const schema = '"orders"';
const table = '"jfood_cart"';
const dbJfood = '"jfood"';
const dbTable = schema + '.' + table;
const dbMenuorder = schema + '.' + "jfood_cart_menu";
const dbOrders = schema + '.' + "orders";
const dbJfoodview = schema + '.' + dbJfood;
const dbDriver = 'public.users';
const dbPricing = 'pricing.pricing_rule';
const dbProcOrderjride = 'orders.order_jride';
const dbviewJride = 'orders.jride';




class customerPaymentModel{

    async paymentOrdernumber (data) {
      try{
        let result ={};
        var d = new Date(Date.now());d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        var dd = d.getDate();var mm = d.getMonth() + 1;var hour = d.getHours();var minute = d.getMinutes();
        var kodeSistem= "JF";
        var FormattedDate = dd + ""+ mm + "" + hour +""+ minute ;
        var strUserid = "" + data.user_id;var strRestoid = "" + data.restaurant_id;
        var padUserid = "000000";var padRestoid = "000000";
        var ansUserid = padUserid.substring(0, padUserid.length - strUserid.length) + strUserid;
        var ansRestoid = padRestoid.substring(0, padRestoid.length - strRestoid.length) + strRestoid;
        var kode = kodeSistem + ansUserid + ansRestoid + FormattedDate;
        console.log(ansUserid, ansRestoid, FormattedDate);
        let sets = [kode, data.user_id, data.restaurant_id, data.landmark_destination, data.address_destination, data.latitude_destination
                    , data.longitude_destination, data.note_destination, data.metode_pembayaran, data.promo_admin_id, data.sub_total, data.ongkir,
                    data.harga_total, d, d, data.diskon_admin, data.diskon_merchant, data.harga_total_merchant, data.kode_promo, data.harga_total_driver]
        let res = await pool.query('INSERT INTO ' + dbTable + '(kode, user_id, restaurant_id, landmark_destination, address_destination, latitude_destination,'+ 
                                    'longitude_destination, note_destination, metode_pembayaran, promo_admin_id, sub_total, ongkir, ' +
                                    'harga_total, created_at, updated_at, diskon_admin, diskon_merchant ,harga_total_merchant ,kode_promo ,harga_total_driver)'+
                                    'VALUES ($1 ,$2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *;', sets);
                                    
        let values =[kode, data.user_id, "Customer Memesan Makanan", data.latitude_destination, data.longitude_destination, data.landmark_destination, data.address_destination,
                                    data.note_destination, data.kode_promo, data.diskon_admin, data.diskon_merchant, data.sub_total, data.ongkir,
                                    data.harga_total_merchant, data.harga_total_driver, data.harga_total, d, d, data.token_customer, data.token_merchant, data.latitude_merchant, data.longitude_merchant,
                                    data.landmark_pickup, data.address_pickup, data.patokan_pickup]
        let orders = await pool.query('INSERT INTO ' + dbOrders + ' (kode, customer_id, status, latitude_location_destination, longitude_location_destination,'+
                                      'landmark_destination, address_destination, patokan_destination, kode_promo, diskon_admin, diskon_merchant, sub_total, ongkir,'+
                                      'total_price_merchant, total_price_driver, total_price_customer, created_at, updated_at, token_customer, token_merchant,'+
                                      'latitude_location_pickup, longitude_location_pickup, landmark_pickup, address_pickup, patokan_pickup)' + 
                                    ' VALUES ($1 ,$2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) RETURNING *;', values)
        console.log("CEK SINIII");
        result.cart = res.rows[0]; result.orders = orders.rows[0];
        return {"result" : result, "kode" : kode};
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async paymentMenu (data) {
      try{
        var d = new Date(Date.now());;d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let sets = [data.jfood_cart_uuid, data.menu_id, data.price_merchant, data.price_customer, data.quantity, data.catatan, d, d, data.jfood_cart_kode]
        let res = await pool.query('INSERT INTO ' + dbMenuorder + ' (jfood_cart_uuid, menu_id, price_merchant, price_customer, quantity, catatan, created_at, updated_at, jfood_cart_kode)' + 
                                  ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;', sets);
        debug('update %o', res);
        let result = res.rows[0];
        return result;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async rejectedorder (data) {
      try{
        var d = new Date(Date.now());d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let value =  [ data.kode, "Customer Menolak Pesanan", data.reason_customer_rejected, "Rejected by Customer", d, d];
        let res = await pool.query('UPDATE ' + dbOrders + ' SET (status, reason_customer_rejected, status_paid_customer, time_customer_rejected, updated_at)'+
                  ' = ($2, $3, $4, $5, $6) WHERE kode = $1 RETURNING kode, status, reason_customer_rejected, status_paid_customer, time_customer_rejected, updated_at;', value);
        debug('register %o', res);
    
        return res.rows[0];
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async detailorder(kode){
      try{
        let result = {};
        let status = await pool.query('SELECT kode, status, customer_id, merchant_id, landmark_pickup, address_pickup, patokan_pickup, landmark_destination, address_destination, patokan_destination, latitude_location_destination, '+
        'longitude_location_destination, latitude_location_pickup, longitude_location_pickup, token_customer, token_driver FROM ' + dbOrders + ' WHERE kode = $1 ORDER BY customer_id ASC;', [kode]);
        let res = await pool.query(' SELECT kode, user_id, customer_name, harga_total_merchant, jumlah_menu, menu_id, menu_name,'+
            ' menu_price_merchant, menu_quantity, menu_catatan FROM ' + dbJfoodview + ' WHERE kode = $1 ORDER BY menu_id ASC',[kode])
        result.status = status.rows;result.data = res.rows;
        debug('get %o', result);

        return result;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async datadriverjfood(id_driver){
      try{
        let status = await pool.query('SELECT id, username, namadepan, namabelakang, photo, phone, nama_kendaraan, pabrikan_kendaraan, plat_nomor, token_notification, latitude_position, longitude_position FROM ' + dbDriver + ' WHERE id = $1;', [id_driver]);
        
        debug('get %o', status.rows[0]);

        return status.rows[0];
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async ongkirJride(distance){
      try{
        var zone = Math.floor(distance/3.9);
        let result ={}
        let status = await pool.query('SELECT rule_id, multiplier, zero_point, created_at FROM ' + dbPricing + ' WHERE service = \'ongkir\' ORDER BY created_at DESC LIMIT 3;');
        let taxQuery = await pool.query('SELECT rule_id, multiplier, zero_point, created_at FROM ' + dbPricing + ' WHERE service = \'komisi jride\' ORDER BY created_at DESC LIMIT 3;');
        console.log(zone);
        let taxValue = taxQuery.rows[0]; let value = status.rows[0];
        result.ongkir = (value.multiplier*distance) + value.zero_point;
        result.taxdriver = Math.floor((taxValue.multiplier/100) *result.ongkir);
        result.data = status.rows[0];
        debug('get %o', result);

        return result;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async orderJride (data) {
      try{
        var d = new Date(Date.now());d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        var dd = d.getDate();var mm = d.getMonth() + 1;var hour = d.getHours();var minute = d.getMinutes();
        var kodeSistem= "JR";
        var FormattedDate = dd + ""+ mm + "" + hour +""+ minute ;
        var strUserid = "" + data.customer_id; var padUserid = "000000";
        var ansUserid = padUserid.substring(0, padUserid.length - strUserid.length) + strUserid;
        var kode = kodeSistem + ansUserid  + FormattedDate;
        let value =  [ kode, data.customer_id, data.latitude_location_pickup, data.longitude_location_pickup, data.landmark_pickup, data.address_pickup, data.note_pickup_pickup, 
                      data.latitude_location_destination, data.longitude_location__destination, data.landmark_destination, data.address_destination, data.note_destination,
                      data.distance, data.estimate_minute, data.ongkir, data.diskon_admin, data.total_price_customer, data.total_price_driver, data.token_customer, data.metode_pembayaran,
                      data.kode_promo, data.tax_driver];
        console.log(kode, d);
        let res = await pool.query('CALL ' + dbProcOrderjride + '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)', value);
        if (res.command == "CALL"){
          return {"data" : data, "kode" : kode};
        }else {
          return {"data" : 'error ' + ex, "kode" : kode};
        }
        
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async datadriverjride(kode){
      try{
        let status = await pool.query('SELECT driver_id, driver_name, phone_driver, photo_driver, plat_nomor, pabrikan_kendaraan, nama_kendaraan, latitude_location_driver_start, longitude_location_driver_start, status FROM ' + dbviewJride + ' WHERE kode = $1;', [kode]);
        
        debug('get %o', status.rows[0]);

        return status.rows[0];
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

}

module.exports = new customerPaymentModel();