'use strict';

module.exports = function(System, app, auth, database) {

  // Profession route
  var profession = require('../controllers/profession');
  app.get('/profession', auth.requiresAdmin, profession.list);
  app.get('/profession/:profession', auth.requiresAdmin, profession.show);
  
  app.post('/profession', auth.requiresAdmin, profession.create);
  app.put('/profession', auth.requiresAdmin, profession.update);
  

};
