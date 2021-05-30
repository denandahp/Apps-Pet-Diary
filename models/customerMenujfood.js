const debug = require('debug')('app:controller:customerMenujfood');
const pool = require('../libs/db');

const schema = '"merchant"';
const table = '"menu"';
const dbTable = schema + '.' + table;
const dbResto = "merchant.restaurant";
const dbKategorimenu = "merchant.kategori_menu";


class customerMenujfoodModel{

    async listMenu(restaurant_id) {
        try{
            
            let result = {};
            let menu = await pool.query(' SELECT id, kategori_menu_id, name, media_photo, description, price_customer, price_merchant, is_active FROM ' + dbTable + ' WHERE restaurant_id = $1 ORDER BY kategori_menu_id ASC', [restaurant_id])
            let kategoriMenu = await pool.query(' SELECT id, name, type, is_active FROM ' + dbKategorimenu + ' WHERE restaurant_id = $1 ORDER BY id ASC', [restaurant_id])
            let infoResto = await pool.query(' SELECT id, name, media_logo,  city, kategori_restaurant_id FROM ' + dbResto + ' WHERE id = $1 ;', [restaurant_id])
            result.menu = menu.rows; result.kategoriMenu = kategoriMenu.rows; result.infoResto = infoResto.rows;
            debug('get %o', result);
            return result;

        }catch(ex){
            console.log('Enek seng salah iki ' + ex);
            return "data " + ex;
        };
      }

      async infoResto(restaurant_id) {
        try{
            
            let res = await pool.query(' SELECT * FROM ' + dbResto + ' WHERE id = $1 ;', [restaurant_id])
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

module.exports = new customerMenujfoodModel();