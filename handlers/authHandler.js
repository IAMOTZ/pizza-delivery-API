const data = require('../lib/data');
const helpers = require('../helpers');

const authHandler = {};

authHandler.login = (reqData, callBack) => {
  const { email, password } = reqData.payload;
  const { success, message } = helpers.validateLoginInfo({ email, password });
  if (!success) {
    return callBack(400, { message });
  }

  const emailAsFileName = email.replace(/\.(.+)$/, '');
  data.read('users', emailAsFileName, (err, userData) => {
    if (err) {
      return callBack(400, { error: 'Email or password incorrect' });
    }
    if (helpers.hash(password) !== userData.password) {
      return callBack(400, { error: 'Email or password incorrect' });
    }
    const token = helpers.createRandomString(20);
    data.create('tokens', token, { email }, (err) => {
      if (err) {
        return callBack(500, { error: 'Unable to create token' });
      }
      return callBack(200, { message: 'Login successful', token });
    });
  });
};

authHandler.logout = (reqData, callBack) => {
  const { token } = reqData.payload;
  if (typeof (token) !== 'string') {
    return callBack(400, { error: 'Token is not valid' });
  }
  data.read('tokens', token, (err, tokenData) => {
    if (err) {
      return callBack(400, { error: 'Token is not valid' });
    }
    data.delete('tokens', token, (err) => {
      if (err) {
        return callBack(500, { error: 'Error deleting token' });
      }
      return callBack(204, {});
    });
  });
};

module.exports = authHandler;
