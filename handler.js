const handler = {};

handler.ping = (reqData, callBack) => {
  callBack(200, { message: 'I am Alive' });
};

handler.notFound = (reqData, callBack) => {
  callBack(404, { message: 'The requested route is not found' });
};

module.exports = handler;
