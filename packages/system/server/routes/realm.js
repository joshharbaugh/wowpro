'use strict';

module.exports = function(System, app, auth, database) {

  // Realm route
  var realm = require('../controllers/realm');
  app.post('/realms', auth.requiresAdmin, realm.listByLocale);
  app.post('/realm/auctions/download', auth.requiresAdmin, realm.downloadAuctionData);
  app.get('/realm/:name/:locale', realm.show);
  app.get('/realm/:name/:locale/auctions/professions', realm.getProfessionsAuctionData);
  app.get('/realm/:name/:locale/professions', realm.calculateAvg);
  app.get('/realm/:name/:locale/profession/:professionName', realm.professionCost);

};
