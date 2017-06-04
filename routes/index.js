var express = require('express');
var router = express.Router();

var Girl = require('../models/girl');

/* GET home page. */
router.get('/', function(req, res, next) {
  Girl.find(function(err, docs) {
    res.render('index', { title: 'Express', girls: docs });
  });
});

module.exports = router;
