var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Girl = require('../models/girl');
var City = require('../models/city');
var multer = require('multer');

// var upload = multer({dest: './public/img'});

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/img');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({storage: storage});

/* GET admin page. */
router.get('/admin', function(req, res, next) {

  Girl.find(function(err, docs) {
    res.render('admin', { girls: docs });
  });

});

/* GET admin page. */
router.get('/girls/:id', function(req, res, next) {

  Girl.findOne({_id: req.params.id}, function (err, docs) {
    res.render('girl', { girl: docs });
  });

});


router.post('/save_girl', upload.single('img'), function(req, res, next) {

  req.body["img"] = req.file.originalname;

  var girl = new Girl(req.body);

  girl.newGirl(function(err, girl) {
    if (err) {
      console.log(err);
      next(err);
    } else {
      City.findOneAndUpdate({name: req.body.city}, { $push: {'girlsId': girl._id}} ,function (err, docs) {
        if (err) next(err);
        res.redirect('/admin');
      });
    }
  });

});

router.get('/delete_girl/:id', function(req, res, next) {

  Girl.delGirlById(req.params.id, function(err, del) {
    if (err) {
      console.log(err);
      next(err);
    } else {
      console.log(del);
      res.redirect('/admin');
    }
  });

});

// Города
router.get('/cities', function(req, res, next) {

  City.find(function(err, docs) {
    res.render('cities', { cities: docs });
  });

});
router.get('/cities/:id', function(req, res, next) {

    // City
    //   .findOne({_id: req.params.id})
    //   .populate({
    //     path: 'girlsId',
    //     populate: {
    //       path: 'girlsId'
    //     }
    //   })
    //   .exec(function (err, docs) {
    //     if (err) {
    //       console.log(err);
    //       next(err);
    //     }
    //     console.log(docs);
    //     res.render('city', { city: docs });
    //   });
  City.findOne({_id: req.params.id}, function(err, city) {
    if (err) next(err);
    if (city) {
      Girl.find({_id: {$in: city.girlsId}}, function (err, girls) {
        res.render('city', {city: city, girls: girls});
      })
    }
  })
  
});

// Поиск
router.get('/search', function(req, res, next) {

  Girl.find({$text: { $search: req.query.search }}, function (err, docs) {
    console.log(docs);
    res.render('search', { girls: docs });
  });

});
router.get('/search_options', function(req, res, next) {
  
  Girl.find({
    $and:[
      { "age": {$gte: req.query.ageFrom} },
      { "age": {$lte: req.query.ageTo} },
      { "city": req.query.city },
      { "price": {$gte: req.query.priceFrom} },
      { "price": {$lte: req.query.priceTo} }
    ]
  }, function (err, docs) {
    res.render('search', { girls: docs });
  });

});

module.exports = router;
