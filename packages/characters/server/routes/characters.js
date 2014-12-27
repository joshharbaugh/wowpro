'use strict';

var characters = require('../controllers/characters');

// Character authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.character.user.id !== req.user.id) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(Articles, app, auth) {

  app.route('/characters')
    .get(auth.isMongoId, auth.requiresLogin, hasAuthorization, characters.all)
    .post(auth.isMongoId, auth.requiresLogin, hasAuthorization, characters.show);
  app.route('/classes/:classId')
    .get(characters.classById);
  app.route('/recipes/:recipeId')
    .get(characters.recipeById);
  app.route('/races')
    .get(characters.races);

  // Finish with setting up the characterName param
};
