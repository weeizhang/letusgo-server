var express = require('express');
var router = express.Router();
var redis = require("redis");
var client = redis.createClient();
var _ = require('lodash');

function addCartItem(item, callback) {
  client.get('cartItems', function (err, obj) {
    obj = JSON.parse(obj) || [];
    if (_.any(obj, {'item': item})) {
      var index = _.findIndex(obj, {'item': item});
      obj[index].num++;
    } else {
      var cartItem = {'item': item, 'num': 1};
      obj.push(cartItem);
    }
    callback(obj);
  });
}

function updateCartItem(id, cartItem, callback) {
  client.get('cartItems', function (err, obj) {
    obj = JSON.parse(obj);
    var index = _.findIndex(obj, {'id': parseInt(id)});
    obj[index] = cartItem;
    callback(obj);
  });
}

function removeCartItem(id, callback) {
  client.get('cartItems', function (err, obj) {
    obj = JSON.parse(obj);
    var index = _.findIndex(obj, {'id': parseInt(id)});
    obj[index].num--;
    if (obj[index].num <= 0) {
      _.remove(obj, obj[index]);
    }
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

router.put('/:id', function (req, res) {
  var cartItem = req.param('cartItem');
  var id = req.params.id;
  updateCartItem(id, cartItem, function (data) {
    client.set('cartItems', JSON.stringify(data), function (err, obj) {
      res.send(data);
    });
  });
});

router.delete('/:id', function (req, res) {
  var id = req.params.id;
  removeCartItem(id, function(data){
    client.set('cartItems', JSON.stringify(data), function (err, obj) {
      res.send(data);
    });
  });
});

module.exports = router;
