const debug = require('debug')('app:model:pet');
const pool = require('../libs/db');
const admin = require('../config/firebase_config.js')

const jsotp = require('jsotp');
const totp = jsotp.TOTP('BASE32ENCODEDSECRET');

const schemapet = '"pets"';
const dbPetcheckup = schemapet + '.' + '"pet_checkup"';

class petModel {

    async addMedcheck(data) {
        try {
            let res;
            var d = new Date(Date.now());
            d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
            let value = [data.pet_id, data.pet_checkup_date, data.pet_note, data.pet_photo, d, d];
            res = await pool.query('INSERT INTO ' + dbPetcheckup + ' (pet_id, pet_checkup_date, pet_note, pet_photo, created_at, updated_at)' +
                ' VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', value);
            // debug('get %o', res);
            return res.rows[0];
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async updateMedcheck(data) {
        try {
            let res;
            var d = new Date(Date.now());
            d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
            let value = [data.id_note, data.pet_id, data.pet_checkup_date, data.pet_note, data.pet_photo, d];
            res = await pool.query('UPDATE ' + dbPetcheckup + ' SET (pet_checkup_date, pet_note, pet_photo, updated_at)' +
                ' = ($3, $4, $5, $6) WHERE id = $1 AND pet_id = $2 RETURNING *', value);
            // debug('get %o', res);
            return res.rows[0];
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async listMedcheck(pet_id, note_id) {
        try {
            let res;
            if (pet_id === 'all') {
                res = await pool.query('SELECT id, pet_id, pet_checkup_date, pet_note, pet_photo, updated_at from ' + dbPetcheckup + '  ORDER BY updated_at DESC ')
            } else if (pet_id != undefined && note_id == 'all') {
                //All note by id pet
                res = await pool.query('SELECT id, pet_id, pet_checkup_date, pet_note, pet_photo, updated_at from ' + dbPetcheckup + ' where pet_id = $1 AND pet_checkup_date IS NOT NULL ORDER BY  ORDER BY updated_at DESC', [pet_id]);
            } else {
                //Detail note by id pet and note id
                res = await pool.query('SELECT id, pet_id, pet_checkup_date, pet_note, pet_photo, updated_at from ' + dbPetcheckup + ' where pet_id = $1 AND id = $2 AND pet_checkup_date IS NOT NULL  ORDER BY updated_at DESC', [pet_id, note_id]);
            }

            //     debug('get %o', res);
            return res.rows;
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async addnote(data) {
        try {
            let res;
            var d = new Date(Date.now());
            d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
            let value = [data.pet_id, data.pet_height, data.pet_weight, data.pet_temperature, data.pet_note, data.pet_photo, d, d];
            res = await pool.query('INSERT INTO ' + dbPetcheckup + ' (pet_id, pet_height, pet_weight, pet_temperature, pet_note, pet_photo, created_at, updated_at)' +
                ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', value);
            // debug('get %o', res);
            return res.rows[0];
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async updatenote(data) {
        try {
            let res;
            var d = new Date(Date.now());
            d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' });
            let value = [data.id_note, data.pet_id, data.pet_height, data.pet_weight, data.pet_temperature, data.pet_note, data.pet_photo, d];
            res = await pool.query('UPDATE ' + dbPetcheckup + ' SET ( pet_height, pet_weight, pet_temperature, pet_note, pet_photo, updated_at)' +
                ' = ($3, $4, $5, $6, $7, $8) WHERE id = $1 AND pet_id = $2 RETURNING *', value);
            // debug('get %o', res);
            return res.rows[0];
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async deletenote(note_id) {
        try {
            let res;
            res = await pool.query('DELETE FROM ' + dbPetcheckup + ' where id = $1 RETURNING * ', [note_id]);
            //  debug('get %o', res);
            return res.rows[0];
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

    async listnote(pet_id, note_id) {
        try {
            let res;
            if (pet_id === 'all') {
                res = await pool.query('SELECT id, pet_id, pet_height, pet_weight, pet_temperature, pet_note, pet_photo, updated_at from ' + dbPetcheckup + '  ORDER BY updated_at DESC')
            } else if (pet_id != undefined && note_id == 'all') {
                console.log("Get All Note Pet By Id_User");
                //All note by id pet
                res = await pool.query('SELECT id, pet_id, pet_height, pet_weight, pet_temperature, pet_note, pet_photo, updated_at from ' + dbPetcheckup + ' where pet_id = $1 AND pet_checkup_date IS NULL  ORDER BY updated_at DESC', [pet_id]);
            } else {
                console.log("Get Note Pet By Id_User");
                //Detail note by id pet and note id
                res = await pool.query('SELECT id, pet_id, pet_height, pet_weight, pet_temperature, pet_note, pet_photo, updated_at from ' + dbPetcheckup + ' where pet_id = $1 AND id = $2 AND pet_checkup_date IS NULL  ORDER BY updated_at DESC', [pet_id, note_id]);
            }

            return res.rows;
        } catch (ex) {
            console.log('Enek seng salah iki ' + ex);
            return { status: '400', Error: "" + ex };
        };
    }

}

module.exports = new petModel();