const calculateTotal = (order) =>
  order.reduce((sum, item) => sum + item.price, 0);
module.exports = { calculateTotal };
