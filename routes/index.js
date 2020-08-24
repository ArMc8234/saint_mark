var express = require('express');
var router = express.Router();
var apiRoutes = require("./api");
const db = require('../models');
var announcements = require('../controllers/eventsController');


/* GET home page. */
router.get('/', function(req, res, next) {
 db.Event.find({})
     .then(function(dbEvent) {
       res.render('index', { title: "Saint Mark United Church of Christ", events: dbEvent })

     }).catch(err => console.log(err));
});

//GET the Event form page
router.get('/events', function(req, res, next) {
  res.render('eventForm', { title: "Events" });
});

//API Routes
router.use("/api", apiRoutes);

module.exports = router;
