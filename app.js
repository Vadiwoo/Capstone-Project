var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var expressSession = require('express-session');
var port = process.env.PORT || 3000;
const db = require('./db');
<<<<<<< HEAD
var bcrypt = require('bcrypt');

=======
>>>>>>> wip
var index = require('./routes/index');
var user = require('./routes/user');
var signIn = require('./routes/sign-in');
var signOut = require('./routes/sign-out');
var createAwards = require('./routes/create-awards');
var userProfile = require('./routes/user-edit-profile');
var deleteAward = require('./routes/user-delete-award');
<<<<<<< HEAD
var dashBoard = require('./routes/dashboard')
=======
var businessAnalytics = require('./routes/business_analytics');
>>>>>>> wip
var app = express();
var spawn = require("child_process").spawn;
var mu = require("mu2");
var fs = require("fs-extra");
var pdfLatex = require('pdflatex');


// view engine setup
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

// ADMIN STUFF
app.get('/admin_main', function(req, res) {
  res.render('admin_main');
});

app.get('/admin_management', function(req,res){
  res.render('admin_management');
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', index);
app.use('/sign-in', signIn);
app.use('/dashboard', dashBoard);
app.use('/create-awards', createAwards)
app.use('/user-edit-profile', userProfile)
app.use('/user-delete-award', deleteAward)
app.use('/user', user);
app.use('/sign-out', signOut);
app.use('/business_analytics', businessAnalytics);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port);
//module.exports = app;
