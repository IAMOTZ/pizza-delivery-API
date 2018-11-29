const data = require('../lib/data');
const helpers = require('../helpers');

const userHandler = {};

userHandler.createUser = (reqData, callBack) => {
  const { name, email, streetAddress, password } = reqData.payload;
  const userInfo = { name, email, streetAddress, password };

  const { success, message } = helpers.validateUserInfo(userInfo); // @TODO: Improve validation logic in validateUserInfo
  if (!success) {
    return callBack(400, { message });
  }
  userInfo.password = helpers.hash(password);
  const emailAsFileName = email.replace(/\.(.+)$/, '');
  data.read('users', emailAsFileName, (err, userData) => {
    if (userData) {
      callBack(400, { 'Error': 'A user with this email already exist' });
    } else {
      data.create('users', emailAsFileName, userInfo, (err) => {
        if (!err) {
          callBack(201, { 'message': 'User successfully created' });
        } else {
          console.log('Error creating user', err);
          callBack(500, { 'Error': 'Could not create a new user' });
        }
      });
    }
  });
};

userHandler.editUser = (reqData, callBack) => {
  const { token } = reqData.payload || reqData.headers;
  helpers.validateToken(token, (err, tokenData) => {
    if (err) {
      return callBack(401, { error: 'Token is not valid' });
    }
    const { name, streetAddress, password } = reqData.payload;
    const userInfo = { name, streetAddress, password };
    const { success, message } = helpers.validateUpdateUserInfo(userInfo);
    if (!success) {
      return callBack(400, { message });
    }
    const emailAsFileName = tokenData.email.replace(/\.(.+)$/, '');
    data.read('users', emailAsFileName, (err, userData) => {
      if (!err && userData) {
        if (name) {
          userData.name = name;
        }
        if (streetAddress) {
          userData.streetAddress = streetAddress;
        }
        if (password) {
          userData.password = helpers.hash(password);
        }
        data.update('users', emailAsFileName, userData, (err) => {
          if (!err) {
            callBack(200, { message: 'User info successfully updated' });
          } else {
            callBack(500, { error: 'Unable to update user info' });
          }
        });
      } else {
        callBack(404, { error: 'User not found' });
      }
    });
  });
}

userHandler.deleteUser = (reqData, callBack) => {
  const { token } = reqData.payload || reqData.headers;
  helpers.validateToken(token, (err, tokenData) => {
    if (err) {
      return callBack(401, { error: 'Token is not valid' });
    }
    const emailAsFileName = tokenData.email.replace(/\.(.+)$/, '');
    data.read('users', emailAsFileName, (err, userData) => {
      if (!err) {
        data.delete('users', emailAsFileName, (err) => {
          if (!err) {
            callBack(200, { 'message': 'User deleted' });
          } else {
            callBack(500, { 'message': 'Unable to delete user' });
          }
        });
      } else {
        callBack(404, { 'Error': 'User not found' });
      }
    });
  });
}

module.exports = userHandler;
