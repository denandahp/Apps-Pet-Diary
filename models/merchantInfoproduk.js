const debug = require('debug')('app:controller:merchantInfoproduk');
const pool = require('../libs/db');

const schema = '"merchant"';
const table = '"menu"';
const dbTable = schema + '.' + table;
const dbKategori = 'merchant.kategori_menu';
const dbRestaurant = 'merchant.restaurant';
const viewKategori = 'merchant.view_kategori_menu';


class merchantInfoprodukModel{
  async register (data) {
    try{
      var d = new Date(Date.now());
      d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
      let value =  [ data.restaurant_id, data.kategori_menu_id,  data.media_photo, data.name, data.description, data.price_merchant, d, d, data.is_active];
      let res = await pool.query('INSERT INTO ' + dbTable + ' (restaurant_id, kategori_menu_id, media_photo, name, description, price_merchant, created_at, updated_at, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;', value);
      let uploadJson = await pool.query('UPDATE ' + dbRestaurant + ' SET state_informasi_merchant = state_informasi_merchant  || \'{"menu":"varified"}\' WHERE user_id = $1 RETURNING state_informasi_merchant;',[data.user_id]);
      debug('register %o', res);
  
      return {"data" : res.rows[0], "state" : uploadJson.rows[0]};
    }catch(ex){
      console.log('Enek seng salah iki ' + ex)
    };
  }

    async update (data) {
      var d = new Date(Date.now());
      d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let sets = [ data.id, data.restaurant_id, data.kategori_menu_id,  data.media_photo, data.name, data.description, data.price_merchant, d, data.is_active];
        let res = await pool.query('UPDATE' + dbTable + 'SET (kategori_menu_id, media_photo, name, description, price_merchant, updated_at, is_active) = ($3, $4, $5, $6, $7, $8, $9) WHERE restaurant_id = $2 AND id = $1 RETURNING *', sets);
        debug('update %o', res);
        let result = res.rows[0];
        return result;
    }

    async get(restaurant_id,id_product,id_kategori) {
    try{
        let res,count;
        console.log(restaurant_id +"  "+id_product+"  "+ id_kategori);
        if(restaurant_id == 'all'){
          res = await pool.query(' SELECT * FROM ' + dbTable + 'ORDER BY restaurant_id ASC')
          return {"data" : res.rows};
        }else {
          if(id_kategori == 'all'){
            res = await pool.query(' SELECT * FROM ' + dbTable + ' where restaurant_id = $1 ORDER BY id ASC', [restaurant_id]);
            return {"data" : res.rows};
          }else{
              if(id_product == 'all'){
                res = await pool.query(' SELECT * FROM ' + dbTable + ' where restaurant_id = $1 AND kategori_menu_id = $2 ORDER BY id ASC', [restaurant_id, id_kategori]);
                count = await pool.query(' SELECT restaurant_id, COUNT (restaurant_id) FROM ' + dbTable + ' where restaurant_id = $1 AND kategori_menu_id = $2 GROUP by restaurant_id;', [restaurant_id, id_kategori]);
                return {"data" : res.rows, "countMenu" : count.rows[0]};
              }else{
              res = await pool.query(' SELECT *, merchant.menu.id AS "id_menu", merchant.menu.name AS "name_menu", '+
                                    ' merchant.kategori_menu.name AS "name_kategori" from merchant.menu '+
                                    ' INNER JOIN merchant.kategori_menu ON merchant.menu.kategori_menu_id = '+
                                    ' merchant.kategori_menu.id WHERE merchant.menu.id = $1;', [id_product]);
              return {"data" : res.rows};

            }
          }
        }
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async getkategori(restaurant_id) {

      let res;
      if(restaurant_id == 'all'){
        res = await pool.query(' SELECT * FROM ' + viewKategori + ' ORDER BY id ASC')
      }else {
        res = await pool.query(' SELECT id, name, is_active, total_menu , total_menu_aktif, total_menu_tidak_aktif FROM ' + viewKategori + ' where restaurant_id = $1  ORDER BY id ASC', [restaurant_id])
      }
      
      debug('get %o', res);

      return res.rows;

    }

    async kategoribaru (data) {
      try{
        var d = new Date(Date.now());
        d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let value =  [ data.name, data.restaurant_id, "normal", d, d, data.is_active]
        let res = await pool.query('INSERT INTO ' + dbKategori + ' (name, restaurant_id, type , created_at, updated_at, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;', value);
        debug('register %o', res);
    
        return res;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async updateKategori (data) {
      try{
        var d = new Date(Date.now());d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let value =  [data.id, data.name, data.restaurant_id, "normal", d, data.is_active];
        let res = await pool.query('UPDATE ' + dbKategori + ' SET (name, restaurant_id ,type, updated_at, is_active) = ($2, $3, $4, $5, $6) WHERE id = $1 RETURNING *;', value);
        debug('register %o', res);
    
        return res;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }


    async stockbaru (data) {
      try{
        var d = new Date(Date.now());
        d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let value =  [ data.id, data.name, data.is_available, d];
        let res = await pool.query('UPDATE ' + dbTable + ' SET (name, is_available, updated_at) = ($2, $3, $4) WHERE id = $1 RETURNING id, name, is_available, updated_at;', value);
        debug('register %o', res);
    
        return res;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async getstock(restaurant_id) {
      try{
        let res;

        if(restaurant_id == 'all'){
          res = await pool.query(' SELECT id, restaurant_id, name, price_merchant, is_available FROM ' + dbTable + ' ORDER BY id ASC')
        }else {
          res = await pool.query(' SELECT id, restaurant_id, name, price_merchant, is_available FROM ' + dbTable + ' WHERE restaurant_id = $1 ORDER BY id ASC', [restaurant_id])
        }

        debug('get %o', res);
        return res.rows;
    }catch(ex){
      console.log('Enek seng salah iki ' + ex)
    };

  }

    async delete(data) {  
    try{
      const res = await pool.query('DELETE from ' + dbTable + ' WHERE id = $1 AND restaurant_id = $2 RETURNING * ', [data.id, data.restaurant_id]);
  
      debug('delete %o', res);
      return res.rows;
    }catch(ex){
      console.log('Enek seng salah iki ' + ex)
    };
  }

  async stateMenu(user_id) {

    let res;
    res = await pool.query(' SELECT id, user_id, state_informasi_merchant FROM ' + dbRestaurant + ' WHERE user_id =$1 ORDER BY id ASC', [user_id])
      debug('get %o', res);

      if (res.rowCount <= 0) {
        return {"data" :"kosong"};
      } else {
        return {"id" : res.rows[0].id,"restaurant_id" : res.rows[0].user_id, "data" : res.rows[0].state_informasi_merchant.menu};
      };
      
    
  }

}

module.exports = new merchantInfoprodukModel();