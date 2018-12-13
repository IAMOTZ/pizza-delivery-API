const helpers = require('../helpers');

const menuItems = {
  1: {
    name: 'Jollof Rice',
    quality: 'Medium',
    price: '500',
  },
  2: {
    name: 'Fried Rice',
    quality: 'High',
    price: '1000',
  },
  3: {
    name: 'Eba',
    quality: 'Medium',
    price: '500',
  },
  4: {
    name: 'Pounded Yam',
    quality: 'High',
    price: '1000',
  },
  5: {
    name: 'Spaghtti',
    quality: 'Low',
    price: '200',
  },
};

const menuHandler = {};

menuHandler.getMenuItems = (reqData, callBack) => {  
  const token = reqData.payload.token || reqData.headers.token;  
  helpers.validateToken(token, (err, tokenData) => {
    if (err) {
      return callBack(401, { error: 'Token is not valid' });
    }
    return callBack(200, { message: 'These are the menu items, enjoy!', menuItems });
  });
}


module.exports = menuHandler;