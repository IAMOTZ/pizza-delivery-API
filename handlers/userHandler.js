const data = require('../lib/data');
const helpers = require('../helpers');

const userHandler = {};

/**
 * @method createUser
 * @memberof userHandler
 * @desc A method to help create a user.
 * 
 * @param {object} reqData The request data
 * @param {function} callBack A callback to execute after the function is done.
 * The callback should recieve the status code as the first argument and the 
 * result of creating the user as second argument.
 */
userHandler.createUser = (reqData, callBack) => {
  const { name, email, streetAddress, password } = reqData.payload;
  const userInfo = { name, email, streetAddress, password };

  const { success, message } = helpers.validateUserInfo(userInfo);
  if (!success) {
    return callBack(400, { message });
  }
  userInfo.password = helpers.hash(password);
  const emailAsFileName = email.replace(/\.(.+)$/, '');
  data.read('users', emailAsFileName, (err, userData) => {
    if (userData) {
      callBack(400, { error: 'A user with this email already exist' });
    } else {
      data.create('users', emailAsFileName, userInfo, (err) => {
        if (!err) {
          return callBack(201, { message: 'User successfully created' });
        }
        callBack(500, { error: 'Could not create a new user' });
      });
    }
  });
};


/**
 * @method editUser
 * @memberof userHandler
 * @desc A method to help edit a user.
 * 
 * @param {object} reqData The request data
 * @param {function} callBack A callback to execute after the function is done.
 * The callback should recieve the status code as the first argument and the 
 * result of creating the user as second argument.
 */
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
      if (err) {
        return callBack(404, { error: 'User not found' });
      }
      userData.name = name || userData.name;
      userData.streetAddress = streetAddress || userData.streetAddress;
      userData.password = helpers.hash(password) || userData.password;
      data.update('users', emailAsFileName, userData, (err) => {
        if(err) {
          return callBack(500, { error: 'Unable to update user info' });
        }
        callBack(200, { message: 'User info successfully updated' });
      });
    });
  });
}

/**
 * @method deleteUser
 * @memberof userHandler
 * @desc A method to help delete a user.
 * 
 * @param {object} reqData The request data
 * @param {function} callBack A callback to execute after the function is done.
 * The callback should recieve the status code as the first argument and the 
 * result of creating the user as second argument.
 */
userHandler.deleteUser = (reqData, callBack) => {
  const { token } = reqData.payload || reqData.headers;
  helpers.validateToken(token, (err, tokenData) => {
    if (err) {
      return callBack(401, { error: 'Token is not valid' });
    }
    const emailAsFileName = tokenData.email.replace(/\.(.+)$/, '');
    data.read('users', emailAsFileName, (err, userData) => {
      if(err) {
        return callBack(404, { error: 'User not found' });
      }
      data.delete('users', emailAsFileName, (err) => {
        if(err) {
          return callBack(500, { error: 'Unable to delete user' }); 
        }
        callBack(200, { message: 'User deleted' });
      });
    });
  });
}

module.exports = userHandler;
