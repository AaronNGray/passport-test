// dependencies

const fs = require('fs');
const path = require('path');
const express = require('express');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser  = require('body-parser');
const session = require('express-session');
const methodOverride = require("method-override");

const passport = require('passport');
const mongoose = require('mongoose');

const User = require('./models/user.js');
const auth = require('./authentication.js');

const config = require('./config/oauth.json');

// connect to the database
mongoose.connect('mongodb://localhost/passport-example');

var app = express();
app.set('port', process.env.PORT || 3000),

/*
app.configure(function() {
  app.set('port', process.env.PORT || 3000),
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'my_precious' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
*/

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(methodOverride());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'uwotm8'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (!err)
      done(null, user);
    else
      done(err, null);
  });
});

// routes
app.get('/', function(req, res) {
  res.render('index', { title: "Start Bootstrap"});
});

app.get('/account', ensureAuthenticated, function(req, res) {
  User.findById(req.session.passport.user, function(err, user) {
    if(err) {
      console.log(err);  // handle errors
    } else {
      res.render('account', { user: user});
    }
  });
});

//
//
//

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){}
);
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/account');
  }
);

app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){}
);
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/account');
  }
);

app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){}
);
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/account');
  }
);

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  }),
  function(req, res){}
);
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/account');
  }
);

app.get('/auth/linkedin',
  passport.authenticate('linkedin'),
  function(req, res){}
);
app.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/account');
  }
);

app.get('/auth/instagram',
  passport.authenticate('instagram'),
  function(req, res){}
);
app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/account');
  }
);

// Pinterest requires an https callback uri
app.get('/auth/pinterest',
  passport.authenticate('pinterest'),
  function(req, res){}
);
app.get('/auth/pinterest/callback',
  passport.authenticate('pinterest', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/account');
  }
);

// https://github.com/stevebest/passport-vkontakte
app.get('/auth/vkontakte',
  passport.authenticate('vkontakte', {
    scope: ['status', 'email', 'friends', 'notify']
  }),
  function(req, res){}
);
app.get('/auth/vkontakte/callback',
  passport.authenticate('vkontakte', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/account');
  }
);

//
//
//

app.get('/', function(req, res) {
    //Here you have an access to req.user
    res.json(req.user);
});

app.get('/error', function(req, res) {
    res.render('error', { title: "Error", req: req, res: res});
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//
//
//

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// test authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

module.exports = app;
