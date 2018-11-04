const crypto = require('crypto');
const validator = require('./lib/validator');

const helpers = {};

helpers.validateUserInfo = (userInfo) => {
  const { name, email, streetAddress, password } = userInfo;
  if (
    typeof (name) !== 'string' ||
    typeof (email) !== 'string' ||
    typeof (streetAddress) !== 'string' ||
    typeof (password) !== 'string'
  ) return { success: false, message: 'All fields must be string' };
  if (name.trim().ength < 5) return { success: false, message: 'User name must be up to 5 characters' };
  if (!validator.isEmail(email)) return { success: false, message: 'Email is not valid' };
  if (streetAddress.trim().length < 7) return { success: false, message: 'Street address must be up to 7 chars' };
  if (password.trim().length < 7) return { success: false, message: 'Password must be up to 7 characters' };
  return { success: true };
};

helpers.validateUpdateUserInfo =(userInfo) => {
  const { email, name, streetAddress, password } = userInfo;

  // Validating email
  if(!validator.isEmail(email)) {
    return { success: false, message: 'Email is not valid. Email is required to update any field.'}
  }

  // Validating name
  if(name && !validator.minCharLength(name, 5)) {
    return { success: false, message: 'User name must be up to 5 characters'}
  }

  // Validating streetAddress
  if(streetAddress && !validator.minCharLength(streetAddress, 7)) {
    return { success: false, message: 'Street address must be up to 7 chars' };
  }

  // Validating password
  if(password && !validator.minCharLength(password, 7)) {
    return { success: false, message: 'Password must be up to 7 chars' };
  }

  if(name || streetAddress || password) {
    return { success: true };
  } else {
    return { success: false, message: 'Provide at least one field to udpate!'};
  }
}

helpers.hash = (str) => {
  if(typeof(str) === 'string') {
    const hashedStr = crypto.createHmac('sha256', 'myLittleDirtySecrete').update(str).digest('hex');
    return hashedStr;
  }
  return false;
}

module.exports = helpers;
