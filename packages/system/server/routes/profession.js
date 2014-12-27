'use strict';

module.exports = function(System, app, auth, database) {

  // Profession route
  var profession = require('../controllers/profession');
  app.route('/profession')
    .get(profession.list)
    .post(profession.create)
    .put(profession.update);
  app.route('/profession/:profession')
    .get(profession.show);

};
