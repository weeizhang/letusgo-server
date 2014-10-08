var express = require('express');
var router = express.Router();
var redis = require('redis');
var client = redis.createClient();
var _ = require('lodash');

function loadItems() {
  var item1 = {'id': 1, 'barcode': 'ITEM000000', 'name': '可口可乐', 'unit': '瓶', 'price': 3.00, 'category': '饮料'};
  var item2 = {'id': 2, 'barcode': 'ITEM000001', 'name': '雪碧', 'unit': '瓶', 'price': 3.00, 'category': '饮料'};
  var item3 = {'id': 3, 'barcode': 'ITEM000002', 'name': '苹果', 'unit': '斤', 'price': 5.50, 'category': '水果'};
  var item4 = {'id': 4, 'barcode': 'ITEM000003', 'name': '荔枝', 'unit': '斤', 'price': 15.00, 'category': '水果'};
  var item5 = {'id': 5, 'barcode': 'ITEM000004', 'name': '电池', 'unit': '个', 'price': 2.00, 'category': '生活用品'};
  var item6 = {'id': 6, 'barcode': 'ITEM000005', 'name': '方便面', 'unit': '袋', 'price': 4.50, 'category': '食品'};
  return [item1, item2, item3, item4, item5, item6];
}

function findObjectInString(string, id) {
  var objects = JSON.parse(string);
  return _.find(objects, {id: id});
}

function getItemById(id, callback) {
  client.get('items', function (err, obj) {
    var item = findObjectInString(obj, parseInt(id));
    callback(item);
  });
}

function putItem(id, item, callback) {
  client.get('items', function (err, obj) {
    obj = JSON.parse(obj);
    var index = _.findIndex(obj, {'id': parseInt(id)});
    obj[index] = item;
    callback(obj);
  });
}

function addItem(item, callback) {
  client.get('items', function (err, obj) {
    obj = JSON.parse(obj);
    item.id = obj[obj.length - 1].id + 1;
    obj[obj.length] = item;
    callback(obj);
  });
}

function removeItem(id, callback) {
  client.get('items', function (err, obj) {
    obj = JSON.parse(obj);
    var index = _.findIndex(obj, {'id': parseInt(id)});
    obj.splice(index, 1);
    callback(obj);
  });
}

var items = loadItems();
client.set('items', JSON.stringify(items));

router.get('/', function (req, res) {
  client.get('items', function (err, obj) {
    res.send(obj);
  });
});

router.get('/id', function (req, res) {
  var id = req.params.id;
  getItemById(id, function (data) {
    res.send(obj);
  });
});

router.put('/:id', function (req, res) {
  var item = req.param('item');
  var id = req.params.id;
  putItem(id, item, function (data) {
    client.set('items', JSON.stringify(data), function (err, obj) {
      res.send(data);
    });
  });
});

router.delete('/:id', function (req, res) {
  var id = req.params.id;
  removeItem(id, function (data) {
    client.set('items', JSON.stringify(data), function (err, obj) {
      res.send(data);
    });
  });
});

router.post('/', function (req, res) {
  var item = req.param('item');
  addItem(item, function (data) {
    client.set('items', JSON.stringify(data), function (err, obj) {
      res.send(data);
    });
  });
});

module.exports = router;
