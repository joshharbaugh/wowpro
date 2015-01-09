'use strict';

angular.module('mean.mean-admin').factory('Logs', ['$http',
    function($http) {
        var get = function(callback) {
            $http.get('/admin/logs').success(function(data, status, headers, config) {
                callback({
                    success: true,
                    logs: data
                });
            }).
            error(function(data, status, headers, config) {
                callback({
                    success: false
                });
            });
        };
        return {
            get: get
        };
    }
]);
