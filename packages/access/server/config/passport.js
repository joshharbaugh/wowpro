'use strict';

var mongoose = require('mongoose'),
  LocalStrategy = require('passport-local').Strategy,
  BnetStrategy = require('passport-bnet').Strategy,
  User = mongoose.model('User'),
  config = require('meanio').loadConfig();

module.exports = function(passport) {

  // Serialize the user id to push into the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialize the user object based on a pre-serialized token
  // which is the user id
  passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    }, '-salt -hashed_password', function(err, user) {
      done(err, user);
    });
  });

  // Use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({
        email: email
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Unknown user'
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
        return done(null, user);
      });
    }
  ));

  // use battle.net strategy
  passport.use(new BnetStrategy({
    clientID: config.battlenet.clientID,
    clientSecret: config.battlenet.clientSecret,
    callbackURL: config.battlenet.callbackURL,
    scope: 'wow.profile'
  }, function(accessToken, refreshToken, profile, done) {
    User.findOne({
      'name': profile.battletag
    }, function(err, user) {
      if (user) {
        user.token = accessToken;
        return User.update({ name: user.name }, user, { upsert: true }, function(err) {
          if(err) {
            console.log(err);
            return done(null, false, {message: err})
          } else {
            return done(err, user)
          }
        })
      }
      user = new User({
        name: profile.battletag,
        username: profile.battletag.split('#')[0],
        provider: 'battlenet',
        roles: ['authenticated'],
        token: accessToken
      });
      user.save(function(err) {
        if (err) {
          console.log(err);
          return done(null, false, {message: 'Battle.net login failed, email already used by other login strategy'});
        } else {
          return done(err, user);
        }
      });
    });
  }));
};
