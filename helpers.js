const crypto = require('crypto');
const validator = require('./lib/validator');
const data = require('./lib/data');

const helpers = {};

/**
 * @method validateUserInfo
 * @memberof helpers
 * @desc An helper function to help validate the details of a user to be created.
 * 
 * @param {object} userInfo The user info to validate.
 * @returns {object} Returns an object.
 * Returned object would always contain property "success" to tell if validation was successful.
 * Returned object can sometimes contain property "message" to tell the reason why validation failed.
 */
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

/**
 * @method validateUpdateUserInfo
 * @memberof helpers
 * @desc An helper function to help validate the details of a user to be edited.
 * 
 * @param {object} userInfo The user info to validate.
 * @returns {object} Returns an object.
 * Returned object would always contain property "success" to tell if validation was successful.
 * Returned object can sometimes contain property "message" to tell the reason why validation failed.
 */
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

/**
 * @method validateDeleteUserInfo
 * @memberof helpers
 * @desc An helper function to help validate the details of a user to be deleted.
 * 
 * @param {object} userInfo The user info to validate.
 * @returns {object} Returns an object.
 * Returned object would always contain property "success" to tell if validation was successful.
 * Returned object can sometimes contain property "message" to tell the reason why validation failed.
 */
helpers.validateDeleteUserInfo = (userInfo) => {
  const { email, password } = userInfo;
  if (typeof (email) !== 'string' || typeof (password) !== 'string') {
    return { success: false, message: 'All fields must be string' };
  }
  return { success: true };
}

/**
 * @method validateLoginInfo
 * @memberof helpers
 * @desc An helper function to help validate the details of a user wanting to login.
 * 
 * @param {object} loginInfo The login details.
 * @returns {object} Returns an object.
 * Returned object would always contain property "success" to tell if validation was successful.
 * Returned object can sometimes contain property "message" to tell the reason why validation failed.
 */
helpers.validateLoginInfo = (loginInfo) => {
  const { email, password } = loginInfo;
  if (typeof (email) !== 'string' || typeof (password) !== 'string' || !validator.isEmail(email)) {
    return { success: false, message: 'Email or Password incorrect' };
  }
  return { success: true };
}

/**
 * @method validateToken
 * @memberof helpers
 * @desc An helper function to help validate a token.
 * 
 * @param {string} token The token to validate.
 * @param {function} callBack An err-first callback to execute when the validation is done.
 * If validation is successful, callBack would get the data stored in token as second argument.
 *
 */
helpers.validateToken = (token, callBack) => {
  if (typeof (token) !== 'string') {
    return callBack(true);
  }
  data.read('tokens', token, (err, tokenData) => {
    if (err) {
      return callBack(true);
    }
    const timeDiff =  new Date().getTime() - new Date(tokenData.createdAt).getTime();
    if (timeDiff > (6 * 60 * 60 * 1000)) {  // Token expires in 6hours
      return callBack(true);
    }
    return callBack(false, tokenData);
  });
}

/**
 * @method hash
 * @memberof helpers
 * @desc An helper function to help hash a string.
 * 
 * @param {string} str The string to be hashed.
 * @returns {string} If hashing is successful, the hashed string would be returned.
 * @return {false} If hashing fails, "false" would be returned.
 */
helpers.hash = (str) => {
  if (typeof (str) === 'string') {
    const hashedStr = crypto.createHmac('sha256', 'myLittleDirtySecrete').update(str).digest('hex');
    return hashedStr;
  }
  return false;
}

/**
 * @method createRandomString
 * @memberof helpers
 * @desc An helper function to help create a length of random strings.
 * 
 * @param {number} length The length of the random string to be created.
 * @returns {string} The random string created.
 */
helpers.createRandomString = (length) => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += letters[Math.floor(Math.random() * 24)];
  }
  return randomString;
}

module.exports = helpers;
