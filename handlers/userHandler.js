const data = require('../lib/data');
const { validateUserInfo, hash } = require('../helpers');

const userHandler = {};

userHandler.createUser = (reqData, callBack) => {
  const { name, email, streetAddress, password } = reqData.payload;
  const userInfo = { name, email, streetAddress, password };

  const { success, message } = validateUserInfo(userInfo); // @TODO: Improve validation logic in validateUserInfo
  if (!success) {
    return callBack(400, { message });
  }
  userInfo.password = hash(password);
  const emailAsFileName = email.replace(/\.(.+)$/, '');
  data.read('users', emailAsFileName, (err, userData) => {
    if (userData) {
      callBack(400, { 'Error': 'A user with this email already exist' });
    } else {
      data.create('users', emailAsFileName, JSON.stringify(userInfo), (err) => {
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

module.exports = userHandler;