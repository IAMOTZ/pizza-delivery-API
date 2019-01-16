const menuItems = require('./menuItems');

module.exports = (order) => `
<h3>You order was created successfully!</h3>
<p>These are the items you ordered: ${order && order.items.map(item => menuItems[item].name).join(', ')}.</p>
<p>Total Price: ${order.price}</p>
<br/><p><i>Thanks for patroning us. Enjoy your pizza!!!</i></p>
`;