var express = require('express');
var router = express.Router();

var redis = require("redis");
var client = redis.createClient();

router.get('/', function (req, res) {

  client.get('cartItems', function (err, obj) {
    res.json(JSON.parse(obj));
  });

});

router.post('/', function (req, res) {

  var cartItems = req.param('cartItems');

  client.set('cartItems', cartItems, function (err, obj) {
    res.send(obj);
  });

});

module.exports = router;
