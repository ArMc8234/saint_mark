var express = require('express');
var router = express.Router();
var apiRoutes = require('./api');
const db = require('../models');
var announcements = require('../controllers/eventsController');


/* GET home page. */
router.get('/', function(req, res, next) {
   db.Event.find({})
      .then(function(dbEvent) {
       res.render('index', { title: "Saint Mark United Church of Christ", events: dbEvent, moment: require('moment') })

     }).catch(err => console.log(err));
});

//GET the Event form page
router.get('/events', function(req, res, next) {
  db.Event.find({})
  .then(function(dbEvent) {
   res.render('eventForm', { title: "Events", events: dbEvent, moment: require('moment') })
 }).catch(err => console.log(err));
});

router.get('/imageUploader', function(req, res, next) {
  res.render('imageUpload', { title: "ImageUpload" });
});

//API Routes
router.use("/api", apiRoutes);

module.exports = router;
