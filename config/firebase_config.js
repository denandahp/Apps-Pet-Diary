const dotenv = require('dotenv');dotenv.config();
const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://petonesia-petdiary-staging-default-rtdb.asia-southeast1.firebasedatabase.app"

});

module.exports = admin;