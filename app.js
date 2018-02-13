var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('config');
var hbs = require('hbs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
//var database = require('database');
//const User = require('./models/user');
var port = process.env.PORT || 3000;
const db = require('./db')
var index = require('./routes/index');
var users = require('./routes/user');
//var employee = require('./routes/employee');
var signIn = require('./routes/sign-in');
var signOut = require('./routes/sign-out');
var createAwards = require('./routes/create-awards');
var userProfile = require('./routes/user-edit-profile');
var deleteAward = require('./routes/user-delete-award')
var app = express();

// Use native promises
//mongoose.Promise = global.Promise;

// view engine setup
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//app.use(expressSession({secret:'SuperSecretPassword'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Authentication
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

//app.use(passport.initialize());
//app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', index);
app.use('/sign-in', signIn);
//app.use('/employee', employee);
app.use('/create-awards', createAwards)
app.use('/user-edit-profile', userProfile)
app.use('/user-delete-award', deleteAward)
app.use('/user', users);

//app.use('/sign-out', sign-out);
//app.use('/organizations', organizations);
//app.use('/profiles', profiles);

//app.use('/sign-up', signUp);

//app.use('/animals', animals);

/*
// Passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
*/


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
