function loadCategories() {
  var categories = [
    {id: 1, name: '饮料'},
    {id: 2, name: '水果'},
    {id: 3, name: '生活用品'},
    {id: 4, name: '食品'}
  ];
  return categories;
}

var express = require('express');
var router = express.Router();

var redis = require("redis");
var client = redis.createClient();

var categories = loadCategories();
client.set('categories', JSON.stringify(categories));

router.get('/', function (req, res) {

  client.get('categories', function (err, obj) {
    res.send(obj);
  });

});

router.post('/', function (req, res) {

  var categories = req.param('categories');

  client.set('categories', categories, function (err, obj) {
    res.send(obj);
  });

});

module.exports = router;
