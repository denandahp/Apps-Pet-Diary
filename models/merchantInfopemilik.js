const debug = require('debug')('app:controller:merchantInfopemilik');
const pool = require('../libs/db');

const schema = '"merchant"';
const table = '"user"';
const dbTable = schema + '.' + table;

class merchantInfopemilikModel{
    async register (data) {
      try{
        var d = new Date(Date.now());
        d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        let value =  [data.id, data.name,  data.media_family,  data.media_identity, data.no_identity, data.birthday, d, data.state_profil_pemilik]
        let res = await pool.query('UPDATE' + dbTable + ' SET (name, media_family, media_identity, no_identity, birthday, updated_at, state_profil_pemilik) = ($2, $3, $4, $5, $6, $7, $8)  WHERE id = $1 RETURNING *;', value);
        debug('register %o', res);
    
        return res;
      }catch(ex){
        console.log('Enek seng salah iki ' + ex)
      };
    }

    async update (data) {
      var d = new Date(Date.now());
      d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
        console.log( data);
        let sets = [data.id, data.name,  data.media_family,  data.media_identity, data.no_identity, data.birthday, d, data.state_profil_pemilik]
        let res = await pool.query('UPDATE' + dbTable + 'SET (name, media_family, media_identity, no_identity, birthday, updated_at, state_profil_pemilik) = ($2, $3, $4, $5, $6, $7, $8) WHERE id = $1 RETURNING *;', sets);
        debug('update %o', res);
        let result = res.rows[0];
        return result;
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

module.exports = new merchantInfopemilikModel();