//Realms service used for realms REST endpoint
angular.module('mean.mean-admin').factory("Realms", ['$resource',
    function($resource) {
        return $resource('/realms', {},
        {
          query: {
            method: 'POST',
            isArray: true
          }
        });
    }
]);
