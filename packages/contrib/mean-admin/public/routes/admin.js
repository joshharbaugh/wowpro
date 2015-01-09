'use strict';
angular.module('mean.mean-admin').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('users', {
                url: '/admin/users',
                templateUrl: 'mean-admin/views/users.html'
            }).state('themes', {
                url: '/admin/themes',
                templateUrl: 'mean-admin/views/themes.html'
            }).state('settings', {
                url: '/admin/settings',
                templateUrl: 'mean-admin/views/settings.html'
            }).state('modules', {
                url: '/admin/modules',
                templateUrl: 'mean-admin/views/modules.html'
            }).state('professions', {
                url: '/admin/professions',
                templateUrl: 'mean-admin/views/professions.html'
            }).state('realms', {
                url: '/admin/realms',
                templateUrl: 'mean-admin/views/realms.html'
            }).state('logs', {
                url: '/admin/logs',
                templateUrl: 'mean-admin/views/logs.html'
            });
    }
]).config(['ngClipProvider',
    function(ngClipProvider) {
        ngClipProvider.setPath('../mean-admin/assets/lib/zeroclipboard/ZeroClipboard.swf');
    }
]);