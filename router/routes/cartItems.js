var express = require('express');
var router = express.Router();
var redis = require("redis");
var client = redis.createClient();
var _ = require('lodash');

function addCartItem(cartItem, callback) {
  client.get('cartItems', function (err, obj) {
    obj = JSON.parse(obj);
    cartItem.id = obj[obj.length - 1].id + 1;
    obj[obj.length] = cartItem;
    callback(obj);
  });
}

router.get('/', function (req, res) {
  client.get('cartItems', function (err, obj) {
    res.send(obj);
  });
});

router.post('/', function (req, res) {
  var cartItem = req.param('cartItem');
  addCartItem(cartItem, function (data) {
    client.set('cartItems', JSON.stringify(data), function (err, obj) {
      res.send(data);
    });
  });
});

module.exports = router;
