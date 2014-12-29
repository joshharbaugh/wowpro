'use strict';

module.exports = function(System, app, auth, database) {

  // Profession route
  var profession = require('../controllers/profession');
  app.get('/profession', profession.list);
  app.get('/profession/:profession', profession.show);
  
  app.post('/profession', auth.requiresAdmin, profession.create);
  app.put('/profession', auth.requiresAdmin, profession.update);
  

};
