var express = require('express');
var router = express.Router();
var redis = require("redis");
var client = redis.createClient();

function loadCategories() {
  var categories = [
    {id: 1, name: '饮料'},
    {id: 2, name: '水果'},
    {id: 3, name: '生活用品'},
    {id: 4, name: '食品'}
  ];
  return categories;
}

function addCategory(catagory, callback) {
  client.get('categories', function (err, obj) {
    obj = JSON.parse(obj);
    catagory.id = obj[obj.length - 1].id + 1;
    obj[obj.length] = catagory;
    callback(obj);
  });
}

function putCategory(id, catagory, callback) {
  client.get('categories', function (err, obj) {
    obj = JSON.parse(obj);
    var index = _.findIndex(obj, {'id': parseInt(id)});
    obj[index] = catagory;
    callback(obj);
  });
}

function removeCategory(id, callback) {
  client.get('categories', function (err, obj) {
    obj = JSON.parse(obj);
    var index = _.findIndex(obj, {'id': parseInt(id)});
    obj.splice(index, 1);
    callback(obj);
  });
}

var categories = loadCategories();
client.set('categories', JSON.stringify(categories));

router.get('/', function (req, res) {
  client.get('categories', function (err, obj) {
    res.send(obj);
  });
});

router.post('/', function (req, res) {
  var category = req.param('categories');
  addCategory(category, function(data) {
    client.set('categories', JSON.stringify(data), function (err, obj) {
      res.send(data);
    });
  });
});

router.put('/:id', function (req, res) {
  var category = req.param('category');
  var id = req.params.id;
  putCategory(id, category, function (data) {
    client.set('categories', JSON.stringify(data), function (err, obj) {
      res.send(data);
    });
  });
});

router.delete('/:id', function (req, res) {
  var id = req.params.id;
  removeCategory(id, function(data){
    client.set('categories', JSON.stringify(data), function (err, obj) {
      res.send(data);
    });
  });
});

module.exports = router;
