'use strict';

//Setting up route
angular.module('mean.characters').config(['$stateProvider',
  function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // states for my app
    $stateProvider
      .state('all characters', {
        url: '/characters',
        templateUrl: 'characters/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('character by name and realm', {
        url: '/characters/:characterName/:characterRealm',
        templateUrl: 'characters/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
