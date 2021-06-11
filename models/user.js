const debug = require('debug')('app:model:user');
const pool = require('../libs/db');
const admin = require('../config/firebase_config.js')

const jsotp = require('jsotp');
const totp = jsotp.TOTP('BASE32ENCODEDSECRET');

const schema = '"users"';
const dbDetail = schema + '.' + '"detail_users"';
const dbUser = schema + '.' + '"users"';
const schemapet = '"pets"';
const dbPets = schemapet + '.' + '"pets"';
const dbPettype = schemapet + '.' + '"pet_type"';
const dbPetdetail = schemapet + '.' + '"pet_detail"';

class UserModel {

  async login(username, password) {
    // password = encryptPassword(password, username);

    const res = await pool.query('SELECT id, namadepan, namabelakang, email, phone, username, password, role, is_verified from ' + dbTable + ' where username = $1', [username]);
    debug('login %o', res);

    if (res.rowCount <= 0) {
      throw new Error('User tidak ditemukan.');
    } else {
      // if (await comparePassword(password, res.rows[0].password)) {
      if (await password == res.rows[0].password) {
        res.rows[0].username = undefined; //undefined gunanya buat ngilangin di res.rows[0]
        res.rows[0].password = undefined;
        res.rows[0].role = undefined;
        return res.rows[0];
      } else {
        throw new Error('Password salah.');
      }
    }
  }

  async signup(data) {
    try{
      let resdet, resuser, result = {};
      var d = new Date(Date.now());d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
      let valueuser = [data.uid_firebase, data.email, data.type_auth, d];
      console.log(valueuser);
      resuser = await pool.query('INSERT INTO ' + dbUser + ' (uid, email, type_auth, created_at) VALUES ($1, $2, $3, $4) RETURNING *', valueuser);
      let valuedet = [data.uid_firebase, data.full_name, data.phone, data.photo_path ,d];
      resdet = await pool.query('INSERT INTO ' + dbDetail + ' (uid_user, full_name, phone, photo_path, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *', valuedet);
      result.detail = resdet.rows[0];
      result.user = resuser.rows[0];
      console.log(result);
      debug('get %o', result);
      return result;

    } catch (ex) {
      console.log('Enek seng salah iki ' + ex)
      return {status:'400', Error : ""+ex};
    };
  }

    async register(data) {
    try{
      const result = await admin.auth().createUser({
        email: data.email,
        emailVerified: false,
        phoneNumber: data.phone,
        password: data.password,
        displayName: data.full_name,
        photoURL: data.photo_url,
        disabled: false,
      });
      return result;
    }catch (error) {
      console.log('Enek seng salah iki ' + error);
      return {status:'400', Error : error};
    };
  }

  async addpet(data) {
    try{
      let res;
      var d = new Date(Date.now());d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
      let value = [data.uid_user, data.pet_name, data.pet_born, data.pet_gender, data.pet_bloodtype, 
                  data.pet_weight, data.pet_height, data.pet_type, data.pet_photo_path, d, d];
      res = await pool.query('INSERT INTO ' + dbPets + ' (uid_user, pet_name, pet_born, pet_gender, pet_blood_type, pet_weight, pet_height, pet_type, pet_photo_path, created_at, updated_at)'+
                            ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', value);
      debug('get %o', res);
      return res.rows[0];
    } catch (ex) {
      console.log('Enek seng salah iki ' + ex);
      return {status:'400', Error : ""+ex};
    };
  }

  async updateprofilpet(data) {
    try{
      let res;
      var d = new Date(Date.now());d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
      let value = [data.uid_user, data.pet_id, data.pet_name, data.pet_born, data.pet_gender, data.pet_bloodtype, 
                  data.pet_weight, data.pet_height, data.pet_type, data.pet_photo_path, d];
      res = await pool.query('UPDATE ' + dbPets + ' SET (pet_name, pet_born, pet_gender, pet_blood_type, pet_weight, pet_height, pet_type, pet_photo_path, updated_at)'+
                            ' = ($3, $4, $5, $6, $7, $8, $9, $10, $11) WHERE uid_user = $1 AND id = $2 RETURNING *', value);
      debug('get %o', res);
      return res.rows[0];
    } catch (ex) {
      console.log('Enek seng salah iki ' + ex);
      return {status:'400', Error : ""+ex};
    };
  }

  async profilepet (pet_id) {

    let res;
    if (pet_id === undefined) {
      res = await pool.query('SELECT * from ' + dbPets + ' ORDER BY id ASC')
    } else {
      res = await pool.query('SELECT * from ' + dbPets + ' where id = $1 ORDER BY id ASC', [pet_id]);
    }
    debug('get %o', res);
    return res.rows[0];
  }

  async deleteprofilpet (pet_id) {
    try{
      let res;
        res = await pool.query('DELETE FROM ' + dbPets + ' where id = $1 RETURNING * ', [pet_id]);
      debug('get %o', res);
      return res.rows[0];
    }catch (ex) {
      console.log('Enek seng salah iki ' + ex);
      return {status:'400', Error : ""+ex};
    };
  }

  async listpet (uid_user) {
    try{
      let res;
      if (uid_user === undefined) {
        res = await pool.query('SELECT pet_name, pet_type, pet_gender, age(pet_born) as age from ' + dbPets + ' ORDER BY uid_user ASC')
      } else {
        res = await pool.query('SELECT pet_name, pet_type, pet_gender, age(pet_born) as age from ' + dbPets + ' where uid_user = $1 ORDER BY uid_user ASC', [uid_user]);
      }
      debug('get %o', res);
      return res.rows;
    }catch (ex) {
      console.log('Enek seng salah iki ' + ex);
      return {status:'400', Error : ""+ex};
    };

  }

}

module.exports = new UserModel();