// server/routes/routes.js
var express = require('express');
var router = express.Router();
var User = require('../../models/User');

router.get('/*', function(req, res, next) {
  res.render('index');
});

router.route('/api/insertUser').post(
  function(req, res, next) {
    if (req.body.email &&
        req.body.password) {
      
      var userData = {
        email: req.body.email,
        password: req.body.password,
      }
      
      // use schema.create to insert data into the db
      User.create(userData, function(err, user) {
        if (err) {
          return next(err)
        } else {
          req.session.userId = user._id;
          return res.redirect('/');
        }
      });
    }
  }
)

router.route('/user').post(
  function(req, res, next) {
    if (req.body.email &&
        req.body.password) {
      console.log("in user")
      var test = User.authenticate(req.body.email, req.body.password, function(error, user) {
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          console.log("Error signing in")
          err.status = 401;
          return next(error);
        } else {
          req.session.userId = user._id;
          console.log(user._id)
          res.send(user._id)
          return req.session.userId;
        }
      });
      // console.log('testing')
      // console.log("test = "+ test)

      // res.json(test)
    }
  }
)

router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;