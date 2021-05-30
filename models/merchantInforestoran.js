const debug = require('debug')('app:controller:merchantInforestoran');
const pool = require('../libs/db');

const schema = '"merchant"';
const table = '"restaurant"';
const dbTable = schema + '.' + table;
const dbkategori = schema + '.kategori_restaurant'
const dbWaktupersiapan = schema +'.option_preparation_in_range'

class merchantInforestoranModel{
  async register (data) {
    try{
      var d = new Date(Date.now());
      d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
      let value =  [ data.user_id,  data.media_logo,  data.media_banner, data.kategori_restaurant_id, data.option_preparation_in_range_id , data.description, d]
      let res = await pool.query('UPDATE ' + dbTable + ' SET (media_logo, media_banner, kategori_restaurant_id, option_preparation_in_range_id , description, updated_at) = ($2, $3, $4, $5, $6, $7) WHERE user_id = $1 RETURNING user_id, name, media_logo, media_banner, kategori_restaurant_id, option_preparation_in_range_id , description, updated_at;', value);
      let uploadJson = await pool.query('UPDATE ' + dbTable + ' SET state_informasi_merchant = state_informasi_merchant  || \'{"profil_restaurant":"varified"}\' WHERE user_id = $1 RETURNING state_informasi_merchant;',[data.user_id]);
      debug('register %o', res);
  
      return {"data" : res.rows[0], "state" : uploadJson.rows[0]};
    }catch(ex){
      console.log('Enek seng salah iki ' + ex)
    };
  }

    async update (data) {
      var d = new Date(Date.now());
      d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let sets = [ data.user_id,  data.media_logo,  data.media_banner, data.kategori_restaurant_id, data.option_preparation_in_range_id , data.description, d]
        let res = await pool.query('UPDATE ' + dbTable + ' SET (media_logo, media_banner, kategori_restaurant_id, option_preparation_in_range_id , description, updated_at) = ($2, $3, $4, $5, $6, $7) WHERE user_id = $1 RETURNING *;', sets);
        debug('update %o', res);
        let result = res.rows[0];
        return result;
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

    async getkategori() {

      let res;
      res = await pool.query(' SELECT id, name FROM ' + dbkategori + ' ORDER BY id ASC')
      
      debug('get %o', res);

      return res.rows;
    }

    async waktupersiapan() {

      let res;
      res = await pool.query(' SELECT id, preparation_in_range, preparation_in_minute FROM ' + dbWaktupersiapan + ' ORDER BY id ASC')
      
      debug('get %o', res);

      return res.rows;

    }

    async delete(data) {  
      const res = await pool.query('DELETE from ' + dbTable + ' where user_id = $1 RETURNING *', [data]);
  
      debug('delete %o', res);
  
      return res;
    }

    async infoRestosaya(user_id) {

      let res;
      res = await pool.query(' SELECT id, user_id, state_informasi_merchant FROM ' + dbTable + ' WHERE user_id =$1 ORDER BY id ASC', [user_id])
      console.log (res.rows);
      console.log (res.rows[0].state_informasi_merchant.profil_restaurant);
      if (res.rows[0].state_informasi_merchant.profil_restaurant == 'kosong' || res.rows[0].state_informasi_merchant.jam_operasional == 'kosong'){
        debug('get %o', res);
        return {"id" : res.rows[0].id,"user_id" : res.rows[0].user_id, "data" : "kosong"};
      }else{
        debug('get %o', res);
        return {"id" : res.rows[0].id, "user_id" : res.rows[0].user_id, "data" : "verified"};
      }

    }

}

module.exports = new merchantInforestoranModel();