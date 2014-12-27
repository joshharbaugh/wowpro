'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Character Schema
 */
var CharacterSchema = new Schema({
  name: String,
  realm: String,
  battlegroup: String,
  class: Number,
  race: Number,
  gender: Number,
  level: Number,
  achievementPoints: Number,
  thumbnail: String,
  spec: {
    name: String,
    role: String,
    backgroundImage: String,
    icon: String,
    description: String,
    order: Number
  },
  guild: String,
  guildRealm: String,
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Statics
 */
CharacterSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Character', CharacterSchema);

var CharacterClassSchema = new Schema({
  id: Number,
  mask: Number,
  powerType: String,
  name: String
});

mongoose.model('Class', CharacterClassSchema);

var CharacterRaceSchema = new Schema({
  id: Number,
  mask: Number,
  side: String,
  name: String
});

mongoose.model('Race', CharacterRaceSchema);
