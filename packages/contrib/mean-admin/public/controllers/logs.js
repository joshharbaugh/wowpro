'use strict';
angular.module('mean.mean-admin').controller('LogsController', ['$scope', 'Global', 'Logs',
    function($scope, Global, Logs) {

        $scope.init = function() {
            Logs.get(function(data) {
                if (data.success) {
                    $scope.logs = data.logs;
                }
            });
        };

    }
]);