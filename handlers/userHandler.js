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
  const { name, email, streetAddress, password } = reqData.payload;
  const userInfo = { name, email, streetAddress, password };
  const { success, message } = helpers.validateUpdateUserInfo(userInfo);
  if (!success) {
    return callBack(400, { message });
  }

  const emailAsFileName = email.replace(/\.(.+)$/, '');
  data.read('users', emailAsFileName, (err, userData) => {
    if (!err && userData) {
      if (name && name !== userData.name) {
        userData.name = name;
      }
      if (streetAddress && streetAddress !== userData.streetAddress) {
        userData.streetAddress = streetAddress;
      }
      if (password && password !== userData.password) {
        userData.password = helpers.hash(password);
      }
      data.update('users', emailAsFileName, userData, (err) => {
        if (!err) {
          callBack(200, { 'message': 'User info successfully updated' });
        } else {
          callBack(500, { 'Error': 'Unable to update user info' });
        }
      });
    } else {
      callBack(404, { 'Error': 'User not found' });
    }
  });
}

module.exports = userHandler;