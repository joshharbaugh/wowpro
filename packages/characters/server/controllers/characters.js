'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Class = mongoose.model('Class'),
  Race = mongoose.model('Race'),
  request = require('request');


/**
 * Find classes
 */
exports.classById = function(req, res, next) {
  Class.find({'id': req.params.classId}).exec(function(err, data) {
    if(err) return next(err);
    res.json(data);
  });
};

exports.recipeById = function(req, res, next) {
  request('https://us.api.battle.net/wow/recipe/' + req.params.recipeId + '?locale=en_US&apikey=' + process.env.BNET_ID, function (err, resp, body) {
    if(err) res.send(500);
    var parsed = JSON.parse(body);
    res.json(parsed);
  });
};

exports.races = function(req, res, next) {
  request('https://us.api.battle.net/wow/data/character/races?locale=en_US&apikey=' + process.env.BNET_ID, function (err, resp, body) {
    if(err) res.send(500);
    var parsed = JSON.parse(body);
    for(var i=0; i<parsed.races.length; i += 1) {
      var race = new Race(parsed.races[i]);
      race.save();
    }
    res.send(200);
  });
};

/**
 * Show a character
 */
exports.show = function(req, res) {
  request('https://us.api.battle.net/wow/character/' + req.body.characterRealm + '/' + req.body.characterName + '?fields=professions&locale=en_US&apikey=' + process.env.BNET_ID, function (err, resp, body) {
    if(err) res.send(500);
    var parsed = JSON.parse(body);
    Class.findOne({'id': parsed.class}, function(err, response) {
      if(err) return res.send(500, err);
      parsed.class = response.name;

      Race.findOne({'id': parsed.race}, function(err, response) {
        if(err) return res.send(500, err);
        parsed.race = response.name;
        res.json(parsed || null);
      });      
    });    
  });
};

/**
 * List of Characters
 */
exports.all = function(req, res) {
  request('https://us.api.battle.net/wow/user/characters?locale=en_US&access_token=' + req.user.token, function (err, resp, body) {
    if(err) res.send(500);
    var parsed = JSON.parse(body);
    res.json(parsed.characters || null);
  });
};
