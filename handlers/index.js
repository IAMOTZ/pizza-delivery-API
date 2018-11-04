const userHandler = require('./userHandler');

const ping = (reqData, callBack) => {
  callBack(200, { message: 'I am Alive' });
};

const notFound = (reqData, callBack) => {
  callBack(404, { message: 'The requested route is not found' });
};

module.exports = Object.assign({ ping, notFound }, userHandler);
