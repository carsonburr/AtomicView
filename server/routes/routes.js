// server/routes/routes.js
var express = require('express');
var router = express.Router();
var User = require('../../models/User');

router.get('/', function(req, res) {
  res.render('index')
});

router.route('/insertUser').post(
  function(req, res) {
    if (req.body.email &&
        req.body.password &&
        req.body.passwordConf) {
    
      var userData = {
        email: req.body.email,
        password: req.body.password,
        passwordConf: req.body.passwordConf
      }
      
      // use schema.create to insert data into the db
      User.create(userData, function(err, user) {
        if (err) {
          return next(err)
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });
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