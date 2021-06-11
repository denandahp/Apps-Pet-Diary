const admin = require('firebase-admin');
const serviceAccount = require('../private_key_petdiary.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;