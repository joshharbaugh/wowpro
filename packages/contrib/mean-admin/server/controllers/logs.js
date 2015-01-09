'use strict';

var mean = require('meanio'),
    fs = require('fs'), 
    byline = require('byline');

exports.get = function(req, res) {
  var stream = byline(fs.createReadStream('system-realm.log', { encoding: 'utf8' })),
      logs = [];

  stream.on('data', function(line) {
    logs.push(JSON.parse(line));
  });

  stream.on('end', function() {
    return res.status(200).json(logs);
  });

};