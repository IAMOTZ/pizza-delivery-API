const crypto = require('crypto');
const https = require('https');
const queryString = require('querystring');
const validator = require('./lib/validator');
const data = require('./lib/data');
const config = require('./config');
const recipientTemplate = require('./lib/recieptTemplate');

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
    const timeDiff = new Date().getTime() - new Date(tokenData.createdAt).getTime();
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
    const hashedStr = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
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
/**
 * @method sendHTTPSRequest
 * @memberof helpers
 * @desc An helper function to help send HTTPS request
 *
 * @param {object} requestDetails The request details
 * @param {object} payload The request payload
 * @param {function} callBack A callback function
 * @returns {void} Does not return anything
 */
helpers.sendHTTPSRequest = (requestDetails, payload, callBack) => {
  const req = https.request(requestDetails, (res) => {
    let responseData = '';
    res.on('data', (d) => {
      responseData += d.toString();
    });
    res.on('end', () => callBack(false, res.statusCode, responseData))
  });
  req.write(payload);
  req.on('error', (e) => {
    callBack(e);
  });
  req.end();
}

/**
 * @method chargeCreditCard
 * @memberof helpers
 * @desc An helper function to help charge credit cards using Stripe.
 *
 * @param {string} cardToken A tokenised credit card details
 * @param {function} callBack A call back function
 */
helpers.chargeCreditCard = (cardToken, amount, callBack) => {
  const payload = {
    amount: amount,
    currency: 'usd',
    source: cardToken,
  };
  const stringPayload = queryString.stringify(payload);
  const requestDetails = {
    protocol: 'https:',
    hostname: 'api.stripe.com',
    method: 'POST',
    path: '/v1/charges',
    auth: config.stripeApiSecret,
  };
  helpers.sendHTTPSRequest(requestDetails, stringPayload, (httpsErr, statusCode, data) => {
    if(httpsErr) return callBack(httpsErr, data);
    if(statusCode == 200) {
      return callBack(false, data);
    }
  });
}

/**
 * @method sendReceipt
 * @memberof helpers
 * @desc An helper function to help send pizza order receipt
 * 
 * @param {string} recipient The email of the recipient of the reciept
 * @param {object} order The pizza order created by the recipient
 * @param {string} order.items The item(s) ordered by the recipient
 * @param {string} order.price The total price of the order created by the recipient
 * @param {function} callBack A callback function
 */
helpers.sendReceipt = (recipient, order, callBack) => {
  const payload = {
    from: 'Pizza Delivery <no-reply@sandbox8269caf78e794f69bb92bedf3b9a07b8.mailgun.org>',
    to: recipient,
    subject: 'Pizza Order Receipt',
    html: recipientTemplate(order),
  };
  const stringPayload = queryString.stringify(payload);
  const requestDetails = {
    protocol: 'https:',
    hostname: 'api.mailgun.net',
    method: 'POST',
    path: `/v3/${config.mailGunDomain}/messages`,
    headers: {
      Authorization: `Bearer ${Buffer.from(`api:${config.mailGunApiKey}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  helpers.sendHTTPSRequest(requestDetails, stringPayload, (httpsErr, statusCode, data) => {
    if(httpsErr) return callBack(httpsErr, data);
    if(statusCode == 200) {
      return callBack(false, data);
    } else {
      return callBack(data)
    }

  });
}

module.exports = helpers;
