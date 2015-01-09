//Professions service used for professions REST endpoint
angular.module('mean.mean-admin').factory("Professions", ['$resource',
    function($resource) {
        return $resource('/profession/:professionName', {
          professionName: '@professionName'
        }, {
          update: {
              method: 'PUT'
          }
        });
    }
]);
