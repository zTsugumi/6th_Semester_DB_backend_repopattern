var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var passport = require('passport');
var config = require('./config');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/usersRouter');
var dishRouter = require('./routes/dishRouter');
var staffRouter = require('./routes/staffRouter');
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favoriteRouter');
var commentRouter = require('./routes/commentRouter');
var reservationRouter = require('./routes/reservationRouter');

const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

connect.then(
  (db) => {           // Resolved
    console.log('Connected correctly to server');
  },
  (err) => {          // Rejected
    console.log(err);
  });

var app = express();

// Redirect all incoming request to HTTPS
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/users', userRouter);

app.use(express.static(path.join(__dirname, 'public')));

// Router
app.use('/dishes', dishRouter);
app.use('/staffs', staffRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);
app.use('/comments', commentRouter);
app.use('/reservation', reservationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
