const express = require('express');
const router = express.Router();
const db = require('../models');
const mid = require('../middleware')
// set up rate limiter: maximum of five requests per minute



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
        const err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = user._id;
        return res.redirect('/events');  //maybe create a profile page with links to events and user sign up later
      }
    });
  } else {
    const err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
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
        const err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }

      // create object with form input
      const userData = {
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
          return res.send('Successful Post');
          // return res.redirect('/events');
        }
      });

    } else {
      const err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
})

module.exports = router;
