const userHandler = require('./userHandler');
const authHandler = require('./authHandler');

/**
 * @func ping
 * @desc A function to help handle request to the "ping" endpoint.
 * This endpoint is basically to tell if the server is alive.
 * 
 * @param {object} reqData The request data.
 * @param {function} callBack A callback to execute after the function is done.
 * The callback should recieve the status code as the first argument and the 
 * result of creating the user as second argument.
 */
const ping = (reqData, callBack) => {
  callBack(200, { message: 'I am Alive' });
};

/**
 * @func notFound
 * @desc A function to help handle any request to an unknown route.
 * 
 * @param {object} reqData The request data.
 * @param {function} callBack A callback to execute after the function is done.
 * The callback should recieve the status code as the first argument and the 
 * result of creating the user as second argument.
 */
const notFound = (reqData, callBack) => {
  callBack(404, { message: 'The requested route is not found' });
};

module.exports = Object.assign({ ping, notFound }, userHandler, authHandler);
