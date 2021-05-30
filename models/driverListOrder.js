const debug = require('debug')('app:model:user');
const pool = require('../libs/db');
const {
    hash
} = require('bcrypt');
const jsotp = require('jsotp');
const totp = jsotp.TOTP('BASE32ENCODEDSECRET');

const detord = 'driver.detail_order';
const jfoodviews = 'orders.jfood';
const jrideviews = 'orders.jride';
const listbyid = 'orders.list_order_driver';

class DriverListOrder {

    async listorder() {

        try {
            let res = await pool.query(`SELECT * FROM ${listbyid}('0') ORDER BY created_at DESC`);
            debug('listorder %o', res);
            if (res.rowCount <= 0) {
                return {
                    "status": "404",
                    "errors": "Aktifitas pengemudi masih kosong"
                }
            } else {
                return res.rows;
            }
        } catch (ex) {
            console.log('Error : ' + ex);
        };
    }

    async listorderbydriver(id) {

        try {
            let res = await pool.query(`SELECT * FROM ${listbyid}(` + id + `) ORDER BY created_at DESC`);
            debug('driverlistorder %o', res);
            if (res.rowCount <= 0) {
                return {
                    "status": "404",
                    "errors": "ID Driver tidak ditemukan"
                }
            } else {
                return res.rows;
            }
        } catch (ex) {
            console.log('Error : ' + ex);
        };
    }

    async detailorderjfood(kode) {

        try {
            let res = await pool.query(`SELECT * FROM ${detord}( '${kode}') `);
            let loc = await pool.query(`SELECT latitude_restaurant, longitude_restaurant, latitude_destination, longitude_destination FROM ${jfoodviews} WHERE "kode" = '${kode}'`);
            debug('detailorderjfood %o', res);
            if (res.rowCount <= 0) {
                return {
                    "status": "404",
                    "errors": "ID Order tidak ditemukan"
                }
            } else {
                return {
                    res: res.rows[0],
                    loc: loc.rows[0]
                }
            }
        } catch (ex) {
            console.log('Error : ' + ex);
        };
    }

    async detailorderjride(kode) {

        try {
            let res = await pool.query(`SELECT id_order, driver_name, time_order_started, time_order_finished, address_pickup, landmark_pickup, customer_name, address_destination, landmark_destination, phone_driver, total_price_customer, total_price_driver, metode_pembayaran, status, latitude_location_pickup, longitude_location_pickup, latitude_location_destination, longitude_location_destination FROM ${jrideviews} WHERE "kode" = '${kode}'`);
            debug('detailorderjride %o', res);
            if (res.rowCount <= 0) {
                return {
                    "status": "404",
                    "errors": "ID Order tidak ditemukan"
                }
            } else {
                return {
                    layanan: "J-Ride",
                    res: res.rows[0]
                }
            }
        } catch (ex) {
            console.log('Error : ' + ex);
        };
    }
}

module.exports = new DriverListOrder();