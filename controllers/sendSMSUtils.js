const { response } = require('express');

const accountSid = 'AC533f974b7e2484c8854e9e7a25d7f675'; 
const authToken = '6bc997bd3f56603f4d599f4d0fca55d2'; 
const client = require('twilio')(accountSid, authToken); 

exports.sendSMSMessage = (userData,randomOTP, res) => {
  return client.messages.create({
    body:'JANGAN BERIKAN kode ini kepada siapa pun, Termasuk TIM JAT. Untuk MASUK KE AKUN, masukkan kode RAHASIA  ' +randomOTP,
    from:'+18623776824',
    to: userData
}, function(err, message) {
    if (err) {
      res.status(400).json( 'Coba periksa kembali nomor handphone yang dimasukkan. Sepertinya ada yg keliru.');
      console.error('Text failed because: '+err.message);
      //return err.message;
    } else {
        console.log('Text sent! Message SID: '+ message.sid);
    }
});
}
exports.checkphone = (userData) => {
  return  client.lookups.phoneNumbers(userData.phone)
          .fetch({countryCode: 'id'})
          .then(phone_number => phone_number)
          .catch(e => e);
}

exports.sendWAmsg = (userData) => {

    return client.messages 
      .create({ 
         body: 'JANGAN BERIKAN kode ini kepada siapa pun, Termasuk TIM JAT. Untuk MASUK KE AKUN, masukkan kode RAHASIA  ' + userData.otp, 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+62' + userData.phone 
       }) 
      .then(response => console.log(response.status))
      .done();

} 
