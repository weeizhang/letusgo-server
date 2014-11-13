module.exports = function(app) {
  app.use('/categories', require('./routes/categories'));
  app.use('/items', require('./routes/items'));
  app.use('/cartItems', require('./routes/cartItems'));
  app.use('/payment', require('./routes/payment'));
};
