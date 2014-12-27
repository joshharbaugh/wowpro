'use strict';

var mongoose = require('mongoose'),
    Profession = mongoose.model('Profession');

/**
 * Create profession
 */
exports.create = function (req, res, next) {
  var newProfession = new Profession(req.body);
  newProfession.save(function(err) {
    if (err) return res.json(400, err);
    return res.json(200, {'status': 'created'});
  });
};

exports.list = function(req, res, next) {
  /*
   * https://dev.battle.net/io-docs
   */

  // set default locale
  if(!req.params.region || req.params.region.toLowerCase() === 'us') {
    Profession.find({}, function (err, professions) {
      if (err) return next(err);
      if (!professions) return res.send(404);

      res.json(professions);
    });
  }
};

exports.update = function(req, res, next) {
  Profession.findByIdAndUpdate(req.body._id, req.body, function (err, profession) {
    if(err) return res.send(500, err);
    res.json(profession);
  });
};

exports.show = function(req, res) {
  /*
   * https://dev.battle.net/io-docs
   */

  // set default locale
  if(!req.params.region || req.params.region.toLowerCase() === 'us') {
    var professionName = req.params.profession;

    Profession.findOne({name: professionName}, function (err, profession) {
      if (err) return res.send(500, err);
      if (!profession) return res.sendStatus(404);

      res.json(profession);
    });
  }
};
