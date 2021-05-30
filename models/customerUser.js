const debug = require('debug')('app:model:customerUser');
const pool = require('../libs/db');
const { hash } = require('bcrypt');
const encryptPassword = require('../libs/secret').encryptPassword;
const comparePassword = require('../libs/secret').comparePassword;
const compareOTP = require('../libs/secret').compareOTP;
const jsotp = require('jsotp');
const totp = jsotp.TOTP('BASE32ENCODEDSECRET');

const schema = '"customer"';
const table = '"users"'
const dbTable = schema + '.' + table;

class UserModel {
  async login (username, password) {
    // password = encryptPassword(password, username);
    const res = await pool.query('SELECT id, username, password, role, email, phone from ' + dbTable + ' where username = $1', [username]);
    debug('login %o', res);

    if (res.rowCount <= 0) {
      throw new Error('User tidak ditemukan.');
    } else {
      // if (await comparePassword(password, res.rows[0].password)) {
      if (await password == res.rows[0].password) {
        res.rows[0].password = undefined; //undefined gunanya buat ngilangin di res.rows[0]
        return res.rows[0];
      } else {
        throw new Error('Password salah.');
      }
    }
  }

  async register (data, randomOTP) {
    let status;
    try{
      
      let otplimit = 120; // in Second
      var d = new Date(Date.now());
      d.setSeconds(d.getSeconds() + otplimit);
      var dd = d.getDate();var mm = d.getMonth() + 1;var y = d.getFullYear();var hour = d.getHours();var minute = d.getMinutes();var second = d.getSeconds();
      var FormattedDate = y + '-'+ mm + '-'+ dd + ' ' + hour+':'+minute+':'+second;
      console.log(FormattedDate);
      let user = [data.namadepan, data.namabelakang, data.username, data.password, data.email, data.phone, data.role, randomOTP, 1, d, d, FormattedDate];
      let res =  await pool.query('INSERT INTO ' + dbTable + ' (namadepan, namabelakang, username, password, email, phone, role, otp, is_verified, user_date, user_lastdate, limit_otp )VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING username,id,phone,email,user_date,otp,limit_otp;', user);
      let created = res.rows[0];
      //console.log(created);
      debug('register %o', res);
      return created;

    }catch(ex){
      console.log('Enek seng salah iki ' + ex)
      return ex;
    };

  }

  async registerlanjut (data) {
    try{
      var d = new Date(Date.now());
      //console.log(created);
      let user = [data.id, data.username, data.phone, data.photo, data.alamat_identitas, d];
      let res = await pool.query('UPDATE' + dbTable + 
              'SET (photo, alamat_identitas, user_lastdate) = ' +
              '($4, $5, $6) WHERE id = $1 AND username = $2 AND phone = $3 RETURNING *',
               user);
      let created = res.rows[0];
      debug('edit %o', res);
      if (res.rowCount <= 0) {
        throw 'register fail';
      } else {
        return created;
      }

    }catch(ex){
      console.log('Enek seng salah iki ' + ex)
    };

  }

  async checkdatauser(data){
    try{
    let status ;
    const res = await pool.query('SELECT * FROM' + dbTable + 'where username = $1 OR email = $2 OR phone = $3',[data.username, data.email, data.phone]);
    if (res.rowCount > 0) {
      if (res.rows[0].username == data.username){return {"status":"400", "errors": "username sudah terdaftar"}}
      else if (res.rows[0].email == data.email){ return {"status":"400", "errors": "email sudah terdaftar"}}
      else if (res.rows[0].phone == data.phone){ return {"status":"400", "errors": "nomor sudah terdaftar"}}
      else{return status = '200'}
    } else {
      return status = '200'
    }

    }catch(ex){
      console.log('Enek seng salah iki ' + ex)
    };
  }
  
  async checkregistrasi(data, randomOTP){
    try{
    let otplimit = 120; // in Second
    var d = new Date(Date.now());
    d.setSeconds(d.getSeconds() + otplimit);
    var dd = d.getDate();var mm = d.getMonth() + 1;var y = d.getFullYear();var hour = d.getHours();var minute = d.getMinutes();var second = d.getSeconds();
    var FormattedDate = y + '-'+ mm + '-'+ dd + ' ' + hour+':'+minute+':'+second;
    let user = [data.namadepan, data.namabelakang, data.username, data.password, data.email, data.phone, data.role, randomOTP, 1, d, FormattedDate];
    const res = await pool.query('SELECT * FROM' + dbTable + 'where username = $1 AND email = $2 AND phone = $3 AND is_verified = $4 ',[data.username,data.email,data.phone,1]);
    if (res.rowCount > 0) {
      const updateregistrasi = await pool.query('UPDATE' + dbTable + 'SET (namadepan, namabelakang, username, password, email, phone, role, otp, is_verified,  user_lastdate, limit_otp )' +
                            '= ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) WHERE username = $3 RETURNING id, namadepan, namabelakang, username, email, phone, role, is_verified, otp, user_lastdate, limit_otp',user);
      let created = updateregistrasi.rows[0];
      debug('register %o', updateregistrasi);
      return {"data" : created, "status" : '200'};
    } else {
      return { "status" : '400'};;
    }

    }catch(ex){
      console.log('Enek seng salah iki ' + ex)
    };
  }

  async verifikasiotp(kodeOTP,username){
    try{
      var d = new Date(Date.now());d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
      const res = await pool.query('SELECT id, username, password, role, phone, otp, limit_otp FROM' + dbTable + 'where username = $1 AND otp = $2',[username,kodeOTP]);
      //console.log(d + " = " + res.rows[0].limit_otp);
      if (res.rowCount <= 0) {
        throw new Error('OTP tidak ditemukan');
        
      } else {
        if (await kodeOTP == res.rows[0].otp && d <= res.rows[0].limit_otp) {
          const updateVerif = await pool.query('UPDATE' + dbTable + 'SET is_verified = $1 WHERE otp = $2 ',[2,kodeOTP]);
          return {"status": "200", "data": updateVerif.rows[0]} ;
        } else {
          throw new Error('OTP salah.');
          // console.log(FormattedDate);
        }
      }
    }catch(ex){
      console.log('Enek seng salah iki ' + ex);
      return{"status": "400", "error" : 'data '+ ex};
    };
  }

  async resendotp (data) {
    let otplimit = 120; // in Second
    var d = new Date(Date.now());d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
    d.setSeconds(d.getSeconds() + otplimit);
    var dd = d.getDate();var mm = d.getMonth() + 1;var y = d.getFullYear();var hour = d.getHours();var minute = d.getMinutes();var second = d.getSeconds();
    var FormattedDate = y + '-'+ mm + '-'+ dd + ' ' + hour+':'+minute+':'+second;
    console.log(FormattedDate);
    var randomOTP = totp.now(); // => generate OTP

    const res = await pool.query('SELECT id, username, password, role, phone, user_lastdate, otp, limit_otp FROM' + dbTable + 'where username = $1 AND phone = $2',[data.username,data.phone]);
    if (res.rowCount <= 0) {
      throw new Error('User tidak ditemukan');
    } else {

      let sets = [data.username, data.phone, randomOTP, d, FormattedDate];
      let resdata = await pool.query('UPDATE' + dbTable + 'SET otp = $3, user_lastdate = $4 , limit_otp = $5 WHERE username =$1 AND phone = $2 RETURNING id,username,phone,otp,user_lastdate,limit_otp', sets);
      
      debug('edit %o', res);
      return {"user" : resdata.rows[0], "limit_otp" : FormattedDate};
    }
  }

  async verifikasiUser (statusUserUpdate) {
    const res = await pool.query('SELECT id, username, role, is_verified FROM' + dbTable + 'where username = $1',[statusUserUpdate.username]);
    //1 =  not verified , 2 = Pending, 3 = Verified
    const updateVerif = await pool.query('UPDATE' + dbTable + 'SET is_verified = $1 WHERE username = $2 ',[statusUserUpdate.is_verified,statusUserUpdate.username]);
  }

  async edit (data) {
    let sets = [data.id, data.namadepan, data.namabelakang, data.username, data.password, data.email, data.origin, data.phone, data.photo, data.role];
    let res = await pool.query('UPDATE' + dbTable + 'SET (namadepan, namabelakang, username, password, email, origin, phone, photo, role) = ($2, $3, $4, $5, $6, $7, $8, $9, $10) WHERE id = $1 RETURNING id,namadepan,namabelakang, username, email, origin, phone,role', sets);
    
    debug('edit %o', res);
    if (res.rowCount <= 0) {
      throw 'Edit fail';
    } else {
      return res;
    }
  }

  async delete (data) {

    let id = data.id;
    let username = data.username;
    let column = (id === undefined) ? 'username' : 'id';

    const res = await pool.query('DELETE from ' + dbTable + ' where ' + column + ' = $1 RETURNING id, username, phone, role', [(id || username)]);

    debug('delete %o', res);

    return res;
  }

  async get (id) {

    let res;

    if (id === undefined) {
      res = await pool.query('SELECT * from ' + dbTable + ' ORDER BY id ASC')
    } else {
      res = await pool.query('SELECT * from ' + dbTable + ' where id = $1 ORDER BY id ASC', [id]);
    }

    debug('get %o', res);

    return res;
    
  }

  async showAllUser (role,status) {

    let res;
    
    if (role === 'all') {
      res = await pool.query('SELECT * from ' + dbTable + ' ORDER BY id ASC')
    } else {
      if(status == 'all'){
        res = await pool.query('SELECT * from ' + dbTable + ' where role = $1 ORDER BY id ASC', [role]);
      }else {
        res = await pool.query('SELECT * from ' + dbTable + ' where role = $1 AND is_verified = $2 ORDER BY id ASC', [role, status]);
      }
    }
    
    debug('get %o', res);

    return res;
    
  }

  
  async searchingdata (data) {
      let res;
      res = await pool.query('SELECT * from ' + dbTable + ' WHERE namadepan = $1 OR namabelakang = $1 OR username = $1 OR email = $1 OR phone = $1 OR phone_darurat = $1',[data]);
      debug('get %o', res);

      if (res.rowCount <= 0) {
        return 'User tidak ditemukan';
      } else {
        return res;
      }  
  }

  async userstatus (id) {

    let res;

    if (id === undefined) {
      res = await pool.query('SELECT username,email, phone, role, is_verified  from ' + dbTable + ' ORDER BY id ASC')
    } else {
      res = await pool.query('SELECT username,email, phone, role, is_verified from ' + dbTable + ' where id = $1 ORDER BY id ASC', [id]);
    }

    debug('get %o', res);

    return res;
    
  }

  async updatetokenfcm (data) {
    try{
      let res,sets;
      sets = [data.id, data.token_notification, data.latitude_position, data.longitude_position]
      res = await pool.query('UPDATE ' + dbTable + ' SET (token_notification, latitude_position, longitude_position) = ($2, $3, $4) WHERE id = $1 RETURNING id, token_notification, latitude_position, longitude_position',sets);
      debug('get %o', res);
  
      if (res.rowCount <= 0) {
        return 'User tidak ditemukan';
      } else {
        return res.rows;
      } 
    }catch(ex){
      console.log('Enek seng salah iki ' + ex)
    }; 
  }
  
}

module.exports = new UserModel();