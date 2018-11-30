const crypto = require('crypto');
const validator = require('./lib/validator');
const data = require('./lib/data');

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

helpers.validateUpdateUserInfo = (userInfo) => {
  const { email, name, streetAddress, password } = userInfo;

  // Validating name
  if (name && !validator.minCharLength(name, 5)) {
    return { success: false, message: 'User name must be up to 5 characters' }
  }

  // Validating streetAddress
  if (streetAddress && !validator.minCharLength(streetAddress, 7)) {
    return { success: false, message: 'Street address must be up to 7 chars' };
  }

  // Validating password
  if (password && !validator.minCharLength(password, 7)) {
    return { success: false, message: 'Password must be up to 7 chars' };
  }

  if (name || streetAddress || password) {
    return { success: true };
  } else {
    return { success: false, message: 'Provide at least one field to udpate!' };
  }
}

helpers.validateDeleteUserInfo = (userInfo) => {
  const { email, password } = userInfo;
  if (typeof (email) !== 'string' || typeof (password) !== 'string') {
    return { success: false, message: 'All fields must be string' };
  }
  return { success: true };
}

helpers.validateLoginInfo = (loginInfo) => {
  const { email, password } = loginInfo;
  if (typeof (email) !== 'string' || typeof (password) !== 'string' || !validator.isEmail(email)) {
    return { success: false, message: 'Email or Password incorrect' };
  }
  return { success: true };
}

helpers.validateToken = (token, callBack) => {
  if (typeof (token) !== 'string') {
    return callBack(true);
  }
  data.read('tokens', token, (err, tokenData) => {
    if (err) {
      return callBack(true);
    }
    const timeDiff =  new Date().getTime() - new Date(tokenData.createdAt).getTime();
    if (timeDiff > (6 * 60 * 60 * 1000)) {
      return callBack(true);
    }
    return callBack(false, tokenData);
  });
}

helpers.hash = (str) => {
  if (typeof (str) === 'string') {
    const hashedStr = crypto.createHmac('sha256', 'myLittleDirtySecrete').update(str).digest('hex');
    return hashedStr;
  }
  return false;
}

helpers.createRandomString = (length) => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += letters[Math.floor(Math.random() * 24)];
  }
  return randomString;
}

module.exports = helpers;
