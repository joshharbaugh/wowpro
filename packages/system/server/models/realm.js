'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Realm Schema
 */
var RealmSchema = new Schema({
  realm: {
    name: String,
    slug: String
  },
  canonical_realm: {
    name: String,
    slug: String
  },
  connected_realms: [],
  locale: {type: String, default: 'en_US'},
  auctions: {
    auctions: [Schema.Types.Mixed]
  },
  averages: [],
  cost: {
    leatherworking: {type: Number, default: 0},
    alchemy: {type: Number, default: 0},
    engineering:  {type: Number, default: 0},
    blacksmithing:  {type: Number, default: 0},
    jewelcrafting:  {type: Number, default: 0},
    inscription:  {type: Number, default: 0},
    tailoring:  {type: Number, default: 0},
    cooking:  {type: Number, default: 0},
    enchanting:  {type: Number, default: 0}
  },
  updated: {type: Date, default: new Date()}
});

mongoose.model('Realm', RealmSchema);
