
// MongoDB setup
const MyMongoose = require('mongoose');

MyMongoose.connect(process.env.MONGOURI,{ useNewUrlParser: true })
.then(() => {
    console.log("Successfully connected to MongoDB.");    
  }).catch(err => {
    console.log('Could not connect to MongoDB.');
    process.exit();
  });


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Load Route
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//Session Setup

const MySession = require('express-session');

// Session Store
const MyMemoryStore = MySession.MemoryStore;
const MysessionStore = new MyMemoryStore();

app.use(MySession(
  {
    store: MysessionStore,
    secret: process.env.SessionSecret,
    resave: false,
    saveUninitialized: true,
    // send the token in a secure cookie
    cookie:{path: '/', httpOnly: true, secure: true, maxAge: 60000, sameSite: 'strict'},
  }
));

// Passport Setup
const MyPassport = require('./config/MyPassport.js');
app.use(MyPassport.initialize());
app.use(MyPassport.session());

// route
app.use('/', indexRouter);

// route for signin
const SigninRouter = require('./routes/signin.js');
app.use('/signin', SigninRouter);

// route for signout
const SignoutRouter = require('./routes/signout.js');
app.use('/signout', SignoutRouter);

//Function to verify if user is authenticated
var Authenticate = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.sendStatus(401);
  }
};

// Restricted route
const PrivateRouter = require('./routes/private.js');
app.use('/private', Authenticate, PrivateRouter);


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
