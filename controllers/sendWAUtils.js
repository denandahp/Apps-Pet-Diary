const axios = require('axios');
const baseURL = 'https://teras.wablas.com/api/send-message';
require('dotenv').config();

const templateMessage = (userData) => {
    return {
        phone: userData.phone,
        message: `Halo! Nomor OTP anda adalah ${userData.otp}`
    }
}
exports.sendWAMessage = (userData) => {
    return axios.post(baseURL, templateMessage(userData), {
        
        headers: {
            'Authorization': `K3VKG5nu25TdV2Nvm7qDhWBX6PMHiKt142C1Wbsm80dSf6C9SnCdwWSVY5jg3kLx`
        }
    }).then(
        response => {
            console.log("oke bos");
            return Promise.resolve(response);
        },
        error => {
            //console.log(error);
            return Promise.reject(error);
        }
    );
}
