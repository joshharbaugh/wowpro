'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Profession Schema
 */
var ProfessionSchema = new Schema({
  id: Number,
  name: {type: String, default: 'FIXME'},
  icon: {type: String, default: null},
  reagents: []
});

module.exports = mongoose.model('Profession', ProfessionSchema);