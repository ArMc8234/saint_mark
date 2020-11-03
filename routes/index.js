var express = require('express');
var router = express.Router();
var apiRoutes = require('./api');
const db = require('../models');
const session = require('express-session');
// const User = require('../models/user');
// var announcements = require('../controllers/eventsController');
const mid = require('../middleware');

// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
  db.User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.name });
        }
      });
});

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', { title: 'Log In'});
});

// POST /login
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    db.User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = user._id;
        return res.redirect('/events');  //maybe create a profile page with links to events and user sign up later
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    // return next(err);
    return res.render('error', { error: next(err) });
  }
});

// GET /register
router.get('/register', mid.loggedOut, function(req, res, next) {
  return res.render('register', { title: 'Sign Up' });
});

// POST /register
router.post('/register', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.password &&
    req.body.confirmPassword) {

      // confirm that user typed same password twice
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        // return next(err);
        return res.render('error', { error: next(err) });
      }

      // create object with form input
      var userData = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      };

      // use schema's `create` method to insert document into Mongo
      db.User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          // return res.send('Successful Post');
          return res.redirect('/profile');
        }
      });

    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      // return next(err);
      return res.render('error', { error: next(err) });
    }
})




/* GET home page. */
router.get('/', function(req, res, next) {
   db.Event.find({})
      .then(function(dbEvent) {
       res.render('index', { title: "Saint Mark United Church of Christ", events: dbEvent, dayjs: require('dayjs') })

     }).catch(err => console.log(err));
});

//GET the Event form page
// router.get('/events', function(req, res, next) {
//   db.Event.find({})
//   .then(function(dbEvent) {
//    res.render('eventForm', { title: "Events", events: dbEvent, moment: require('moment') })
//  }).catch(err => console.log(err));
// });

router.get('/events', mid.requiresLogin, function(req, res, next) {
  db.User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          db.Event.find({})
          .then(function(dbEvent) {
          res.render('eventForm', { title: "Events", events: dbEvent, dayjs: require('dayjs') })
           }).catch(err => console.log(err));
        }
      });
});

//GET the Gallery form page
router.get('/gallery', function(req, res, next) {
  db.Gallery.find({})
  .then(function(dbGallery) {
   res.render('gallery', { title: "Gallery", galleries: dbGallery })
 }).catch(err => console.log(err));
//  console.table(dbGallery)
});

router.get('/imageUploader', mid.requiresLogin, function(req, res, next) {
  db.User.findById(req.session.userId)
    .exec(function(error, user) {
      if(error) {
        return next(error);
      } else {
        res.render('imageUpload', { title: "ImageUpload" });
      }
    })
});


//API Routes
router.use("/api", apiRoutes);

module.exports = router;
