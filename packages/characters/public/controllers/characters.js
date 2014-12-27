'use strict';

angular.module('mean.characters').controller('CharactersController', ['$scope', '$stateParams', '$location', 'Global', 'Characters',
  function($scope, $stateParams, $location, Global, Characters) {
    $scope.global = Global;

    $scope.hasAuthorization = function(character) {
      if (!character || !character.user) return false;
      return $scope.global.isAdmin || character.user._id === $scope.global.user._id;
    };

    $scope.find = function() {
      Characters.query(function(characters) {
        $scope.characters = characters;
      });
    };

    $scope.findOne = function() {
      Characters.fetch({
        characterName: $stateParams.characterName,
        characterRealm: $stateParams.characterRealm
      }, function(character) {
        $scope.character = character;
        console.log($scope.character);
      });
    };
  }
]);
