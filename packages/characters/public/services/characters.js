'use strict';

//Characters service used for characters REST endpoint
angular.module('mean.characters').factory('Characters', ['$resource',
  function($resource) {
    return $resource('characters', {},
      {
        fetch: {
          method: 'POST'
        }
      });
  }
]).factory('Recipes', ['$resource',
  function($resource) {
    return $resource('recipes/:recipeId', {
      recipeId: '@recipeId'
    },{
      get: {
        method: 'GET',
        cache: true
      }
    });
  }
]);
