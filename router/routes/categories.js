function loadCategories(){
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

router.get('/', function(req, res) {
  //TODO: Need to implement.
  res.send('Success!');
});

module.exports = router;
