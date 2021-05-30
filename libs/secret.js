const crypto = require('crypto');
const bcrypt = require('bcrypt');
const secret = require('../configs.json').secret;

module.exports.encryptPassword = function (plainText, pepper) {
  return crypto.createHmac('sha256', plainText)
               .update(secret).update(pepper).digest('base64');
};

module.exports.comparePassword = async (input, stored) => {
  console.log(input + "  " + stored);
  let compareResult = await bcrypt.compare(input, stored);
  return compareResult;
}

module.exports.compareOTP = async (input, stored) => {
  let compareResult = await bcrypt.compare(input, stored);
  return compareResult;
}

module.exports.generatePassword = (username, size = 6) => {
  let generated = crypto
    .randomBytes(size)
    .toString('base64')
    .slice(0, size);
  return generated
}