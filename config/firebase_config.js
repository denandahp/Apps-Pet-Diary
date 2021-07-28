const admin = require('firebase-admin');
const serviceAccount = require('../private_key_petdiary.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://petonesia-petdiary-staging-default-rtdb.asia-southeast1.firebasedatabase.app"

});

module.exports = admin;