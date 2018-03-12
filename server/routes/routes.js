// server/routes/routes.js
var express = require('express');
var router = express.Router();
var User = require('../../models/User');

// var UserSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   jsonAtomsAndBondsArray: [{ key: String, jsonAtomsAndBonds: String }],
// });

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
);

router.route('/save').post(
  function(req, res, next) {
    if (req.session.signedIn && req.session.userId) {
      if(req.body.key && req.body.jsonAtomsAndBonds) {
        var tmp = {
          key : req.body.key, 
          jsonAtomsAndBonds : req.body.jsonAtomsAndBonds
        }
        
        User.update({_id : req.session.userId, 
                    "jsonAtomsAndBondsArray": { $elemMatch: { "key": req.body.key } } },
          {$set: 
            {
              "jsonAtomsAndBondsArray.$.jsonAtomsAndBonds" : req.body.jsonAtomsAndBonds              
            }
          }, {}, function (err, raw) {

            // console.log('The raw response from Mongo was ', raw);
            if (err) {
              console.log("error: " + err);
            } else if(raw == null || raw.nModified == 0) {

              User.update({_id : req.session.userId},
                {$addToSet: 
                  {
                    jsonAtomsAndBondsArray : tmp              
                  }
                }, {}, function (err, raw) {
                  if (err) console.log("error: " + err);
                  // console.log('The 2nd raw response from Mongo was ', raw);
                });
            }
          });
        
      }
    } else {
      console.log("in /save but does not seem to be signed in")
    }
  }  
);

router.route('/molList').post(
  function(req, res, next) {
    if (req.session.signedIn && req.session.userId) {

      User.find({ "_id": req.session.userId },
                { "jsonAtomsAndBondsArray.jsonAtomsAndBonds": 0},
        function(err, data) {
          if (err) {
            console.log(err);
            return err;
          }
          if (data) {
            res.send(data);
          } else {
            console.log("No data found");
          }
        })
    } else {
      console.log("in /molList but not signed in");
    }
  }
);

router.route('/retrieve').post(
  function(req, res, next) {
    if (req.session.signedIn && req.session.userId) {
      console.log("Retrieving data");
      console.log("userId: " + req.session.userId);
      console.log("key: " + req.body.key)
      if(req.body.key) {
        User.findOne({ "_id" : req.session.userId},
                      { "jsonAtomsAndBondsArray": {$elemMatch: {key: req.body.key }}},
          function (err, data) {
            if(err) {
              console.log(err);
              return err;
            }
            if (data) {
              res.send(data)
            } else {
              console.log("No data found")
            }
          }
          );
      }
    } else {
      console.log("in /retrieve but does not seem to be signed in")
    }
  }  

);

router.route('/user').post(
  function(req, res, next) {
    if (req.body.email &&
        req.body.password) {
      var test = User.authenticate(req.body.email, req.body.password, function(error, user) {
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          console.log("Error signing in")
          err.status = 401;
          return next(error);
        } else {
          req.session.userId = user._id;
          req.session.signedIn = true;
          res.send(user._id)
          return req.session.userId;
        }
      });
      // console.log('testing')
      // console.log("test = "+ test)

      // res.json(test)
    }
  }
);

router.route('/logout').post(function(req, res, next) {
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