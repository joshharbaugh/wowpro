'use strict';

module.exports = function(System, app, auth, database) {

  // Realm route
  var realm = require('../controllers/realm');
  app.route('/realms')
    .post(realm.listByLocale);
  app.route('/realm/auctions/download')
    .post(realm.downloadAuctionData);
  app.route('/realm/:name/:locale')
    .get(realm.show);
  app.route('/realm/:name/:locale/auctions/professions')
    .get(realm.getProfessionsAuctionData);
  app.route('/realm/:name/:locale/professions')
    .get(realm.calculateAvg);
  app.route('/realm/:name/:locale/profession/:professionName')
    .get(realm.professionCost);

};
