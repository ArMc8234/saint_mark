const createError = require('http-errors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const mongoSanitize = require('express-mongo-sanitize');
const logger = require('morgan');
const mongoose = require('mongoose');
const aws = require('aws-sdk');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const indexRouter = require('./routes/index');


const app = express();

// To protect against injection attacks by removing prohibited data
app.use(mongoSanitize());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

// set up rate limiter: maximum of five requests per minute

const limiter = rateLimit({
  windowMs: 15*60*1000, // 1 minute
  max: 100
});

// apply rate limiter to all requests
app.use(limiter);


//The mongoose connection and session set up needed to be written before the other app settings in order to be read and to define req.session.
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/stMark", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));


  
// use sessions for tracking logins. The session data is in mongo instead of RAM. It keeps site from crashing.
// 
const csrfProtection = csrf();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));


// make user ID available in templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');

// Added ejs.renderFile, S3_Bucket, and config region for file upload into AWS
// app.set('view engine', 'pug', require('ejs').renderFile);
const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-east-1';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(csrf({ cookie: false }));
app.use('/', indexRouter);
// app.use('/users', usersRouter);

//Set up Mongo Database
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
