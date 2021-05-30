const debug = require('debug')('app:controller:customerFilterfood');
const pool = require('../libs/db');

const schema = '"merchant"';
const table = '"restaurant"';
const dbTable = schema + '.' + table;
const dbKategoriresto = "merchant.kategori_restaurant";
const dbFilterkategori = "merchant.search_restaurant_by_category";
const dbFiltermenu = "merchant.search_restaurant_by_menu";
const dbFilterallresto = "merchant.search_all_restaurant_by_menu";



class customerFilterfoodModel{
    async searchbyName (data) {
      let page = parseInt(data.page);let limit = parseInt(data.limit); let filterName = data.filterName;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      let counts, res;
      let results = {}, err = [];
      var d = new Date(Date.now()); d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
      try{
        if(filterName == "all"){
          counts= await pool.query('SELECT COUNT (*)  FROM ' + dbTable);
        }else{
          counts = await pool.query('SELECT COUNT (*)  FROM ' + dbFiltermenu + '($1, $2, $3)', [filterName, data.latitude, data.longitude]);
        };
        console.log(filterName, startIndex, limit, endIndex, counts.rows[0].count);
        if (endIndex <= counts.rows[0].count) {
          results.next = {
            page: page + 1,
            limit: limit
          }
        }else{ throw new Error('data kosong');};

        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit
          }
        }else{results.previous ={ page : 0, limit: limit} };
        results.countResto = counts.rows[0].count;
        if(filterName == "all"){
          res = await pool.query('SELECT id, name, media_logo, city, kategori_restaurant_id FROM' + dbTable + ' ORDER BY distance ASC OFFSET $1 LIMIT $2', [startIndex, limit]);
          results.res = res.rows;
        }else{
          let sets = [filterName, data.latitude, data.longitude, startIndex, limit]
          res = await pool.query('SELECT * FROM ' + dbFiltermenu + '($1, $2, $3) ORDER BY distance ASC OFFSET $4 LIMIT $5;', sets);
          results.res = res.rows;
        }
        results.date = d;
        console.log(d);
        debug('register %o', results);
        return results;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex);
        return {"error": "data" + ex, "res" : err};
      };
    }

    async searchBycategory (data) {
      let page = parseInt(data.page); let limit = parseInt(data.limit);let idKategori = parseInt(data.idKategori);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      let counts, res, results = {}, err = [];
      var d = new Date(Date.now()); d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
      try{
        if(data.idKategori == "all"){
          counts= await pool.query('SELECT COUNT (*)  FROM ' + dbTable);
        }else{
          console.log(data.idKategori, data.latitude, data.longitude, startIndex, limit, endIndex);
          counts = await pool.query('SELECT COUNT (*)  FROM ' + dbFilterkategori + ' ($1, $2, $3)', [idKategori, data.latitude, data.longitude]);
        };
        console.log("cek sini");
        console.log(data.idKategori, startIndex, limit, endIndex, counts.rows[0].count);
        if (endIndex <= counts.rows[0].count) {
          results.next = {
            page: page + 1,
            limit: limit
          }
        }else{ throw new Error('data kosong');};

        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit
          }
        }else{results.previous ={ page : 0, limit: limit} };
        results.countResto = counts.rows[0].count;
        if(data.idKategori == "all"){
          res = await pool.query('SELECT id, name, media_logo, city, kategori_restaurant_id FROM' + dbTable + ' ORDER BY distance ASC OFFSET $1 LIMIT $2', [startIndex, limit]);
          results.res = res.rows;
        }else{
          let sets = [data.idKategori, data.latitude, data.longitude, startIndex, limit]
          res = await pool.query('SELECT * FROM ' + dbFilterkategori + '($1, $2, $3) ORDER BY distance ASC OFFSET $4 LIMIT $5;', sets);
          results.res = res.rows;
        }
        results.date = d;
        console.log(d);
        debug('register %o', results);
        return results;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex);
        return {"error": "data" + ex, "res" : err};
      };
    }

    async allResto (data) {
      let page = parseInt(data.page); let limit = parseInt(data.limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      let counts, res, results = {}, err = [];
      var d = new Date(Date.now()); d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
      try{
        if(data.filterName == "all"){
          counts= await pool.query('SELECT COUNT (*)  FROM ' + dbFilterallresto);
        }else{
          console.log(data.filterName, data.latitude, data.longitude, startIndex, limit, endIndex);
          counts = await pool.query('SELECT COUNT (*)  FROM ' + dbFilterallresto + ' ($1, $2, $3)', [data.filterName, data.latitude, data.longitude]);
        };
        console.log("cek sini");
        console.log(data.filterName, startIndex, limit, endIndex, counts.rows[0].count);
        if (endIndex <= counts.rows[0].count) {
          results.next = {
            page: page + 1,
            limit: limit
          }
        }else{ throw new Error('data kosong');};

        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit
          }
        }else{results.previous ={ page : 0, limit: limit} };
        results.countResto = counts.rows[0].count;
        if(data.filterName == "all"){
          res = await pool.query('SELECT id, name, media_logo, city, kategori_restaurant_id FROM' + dbFilterallresto + ' ORDER BY distance ASC OFFSET $1 LIMIT $2', [startIndex, limit]);
          results.res = res.rows;
        }else{
          let sets = [data.filterName, data.latitude, data.longitude, startIndex, limit]
          res = await pool.query('SELECT * FROM ' + dbFilterallresto + '($1, $2, $3) ORDER BY distance ASC OFFSET $4 LIMIT $5;', sets);
          results.res = res.rows;
        }
        results.date = d;
        console.log(d);
        debug('register %o', results);
        return results;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex);
        return {"error": "data" + ex, "res" : err};
      };
    }

    async jFoodlist() {
        try{
            let res;
            res = await pool.query(' SELECT id, type, name FROM ' + dbKategoriresto + ' ORDER BY id ASC')

            debug('get %o', res);
            return res.rows;

        }catch(ex){
            console.log('Enek seng salah iki ' + ex);
            return {"error": "data" + ex, "data " : err};
        };
      }

    async filterinname (data) {
        let page = parseInt(data.page); let limit = parseInt(data.limit);
        let value = [data.keyword, data.latitude, data.longitude, 
                    data.harga_1, data.harga_2, data.harga_3, data.harga_4, 
                    data.jenis_menu_1, data.jenis_menu_2, data.jenis_menu_3, data.jenis_menu_4, 
                    data.rating_minimal, data.order_by];
        
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        let counts, res;
        let results = {}, err = [];
        var d = new Date(Date.now()); d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        try{
          console.log(value);
          counts = await pool.query('SELECT COUNT (*)  FROM ' + dbFiltermenu + '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', value);
          console.log(data.keyword, startIndex, limit, endIndex, counts.rows[0].count);
          if (endIndex <= counts.rows[0].count) {
            results.next = {
              page: page + 1,
              limit: limit
            }
          }else{ throw new Error('data kosong');};
  
          if (startIndex > 0) {
            results.previous = {
              page: page - 1,
              limit: limit
            }
          }else{results.previous ={ page : 0, limit: limit} };
          results.countResto = counts.rows[0].count;
          let sets = [data.keyword, data.latitude, data.longitude, 
                    data.harga_1, data.harga_2, data.harga_3, data.harga_4, 
                    data.jenis_menu_1, data.jenis_menu_2, data.jenis_menu_3, data.jenis_menu_4, 
                    data.rating_minimal, data.order_by, startIndex, limit]
          res = await pool.query('SELECT * FROM ' + dbFiltermenu + '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ORDER BY distance ASC OFFSET $14 LIMIT $15;', sets);
          results.res = res.rows;
          results.date = d;
          console.log(d);
          debug('register %o', results);
          return results;
        }catch(ex){
          console.log('Enek seng salah iki ' + ex);
          return {"error": "data" + ex, "res" : err};
        };
      }
  
      async filterincategory (data) {
        let page = parseInt(data.page); let limit = parseInt(data.limit); let idKategori = parseInt(data.idKategori)
        let value = [idKategori, data.latitude, data.longitude, 
                    data.harga_1, data.harga_2, data.harga_3, data.harga_4, 
                    data.jenis_menu_1, data.jenis_menu_2, data.jenis_menu_3, data.jenis_menu_4, 
                    data.rating_minimal, data.order_by];
        
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        let counts, res;
        let results = {}, err = [];
        var d = new Date(Date.now()); d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        try{
          console.log(value);
          counts = await pool.query('SELECT COUNT (*)  FROM ' + dbFilterkategori + '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', value);
          console.log(idKategori, startIndex, limit, endIndex, counts.rows[0].count);
          if (endIndex <= counts.rows[0].count) {
            results.next = {
              page: page + 1,
              limit: limit
            }
          }else{ throw new Error('data kosong');};
  
          if (startIndex > 0) {
            results.previous = {
              page: page - 1,
              limit: limit
            }
          }else{results.previous ={ page : 0, limit: limit} };
          results.countResto = counts.rows[0].count;
          let sets = [idKategori, data.latitude, data.longitude, 
                    data.harga_1, data.harga_2, data.harga_3, data.harga_4, 
                    data.jenis_menu_1, data.jenis_menu_2, data.jenis_menu_3, data.jenis_menu_4, 
                    data.rating_minimal, data.order_by, startIndex, limit]
          res = await pool.query('SELECT * FROM ' + dbFilterkategori + '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ORDER BY distance ASC OFFSET $14 LIMIT $15;', sets);
          results.res = res.rows;
          results.date = d;
          console.log(d);
          debug('register %o', results);
          return results;
        }catch(ex){
          console.log('Enek seng salah iki ' + ex);
          return {"error": "data" + ex, "res" : err};
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

module.exports = new customerFilterfoodModel();