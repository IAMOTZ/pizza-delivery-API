const helpers = require('../helpers');
const menuItems = require('../lib/menuItems');

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

menuHandler.createOrder = (reqData, callBack) => {  
  const token = reqData.payload.token || reqData.headers.token;  
  helpers.validateToken(token, (err, tokenData) => {
    if (err) {
      return callBack(401, { error: 'Token is not valid' });
    }
    let { items, cardToken } = reqData.payload;
    cardToken = typeof cardToken !== 'string' ? 'tok_visa' : cardToken; 
    const menuItemIds =  Object.keys(menuItems).map(Number);
    if (!items || !items.length || !items.every(item => menuItemIds.includes(item))) {
      return callBack(400, { error: 'Invalid item selection'});
    }
    const price = items.reduce((acc, curr) => acc + menuItems[curr].price, 0);
    helpers.chargeCreditCard(cardToken, price, (stripeErr) => {
      if(stripeErr) {
        return callBack(500, { error: 'Error charging credit card'});
      }
      helpers.sendReceipt(tokenData.email, {items, price}, (mailErrr) => {
        if(mailErrr) {
          return callBack(500, { error: 'Error sending delivery mail'});
        }
        return callBack(200, 'Order created!!')
      })
    });
  });
}


module.exports = menuHandler;