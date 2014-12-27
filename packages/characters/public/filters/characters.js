'use strict';

angular.module('mean.characters')
  .filter('recipeName', ['Recipes','$timeout', function (Recipes, $timeout) {

    return function(input) {

      return Recipes.get({recipeId: input}, function() {}).name;
      
    };

  }]);