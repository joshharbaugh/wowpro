'use strict';

angular.module('mean.mean-admin').controller('ProfessionsController', ['$scope', 'Global', 'Menus', '$rootScope', '$http', 'Professions',
    function($scope, Global, Menus, $rootScope, $http, Professions) {
        $scope.global = Global;
        $scope.professionSchema = [{
            title: 'ID',
            schemaKey: 'id',
            type: 'number',
            inTable: true
        }, {
            title: 'Name',
            schemaKey: 'name',
            type: 'text',
            inTable: true
        }, {
            title: 'Icon',
            schemaKey: 'icon',
            type: 'text',
            inTable: true
        }];
        $scope.reagentSchema = [{
            title: 'ID',
            schemaKey: 'id',
            type: 'number',
            inTable: true
        }, {
            title: 'Qty',
            schemaKey: 'quantity',
            type: 'number',
            inTable: true
        }];
        $scope.profession = {};
        $scope.predicate = 'name';

        $scope.init = function() {
            Professions.query({}, function(professions) {
                $scope.professions = professions;
            });
        };

        $scope.sort = function(field) {
            $scope.predicate = field.toLowerCase();
            $scope.reverse = !$scope.reverse;
        };

        $scope.add = function() {
            if (!$scope.professions) $scope.professions = [];

            var profession = new Professions({
                id: $scope.profession.id,
                name: $scope.profession.name,
                icon: $scope.profession.icon
            });

            profession.$save(function(response) {
                if(response.status === 'created') {
                    $scope.professions.push(profession);
                }
            });
        };

        $scope.addReagent = function(reagent, profession) {
            profession.reagents.push(reagent);
            profession.$update(function(response) {
                if(response) {
                    $scope.reagent_new = {};
                    $scope.init();
                    $scope.selectedProfession = response;
                    $scope.reagents = $scope.selectedProfession.reagents;
                }
            });
        };

        $scope.remove = function(profession) {
            for (var i in $scope.professions) {
                if ($scope.professions[i] === profession) {
                    $scope.professions.splice(i, 1);
                }
            }

            profession.$remove();
        };

        $scope.update = function(profession, professionField) {
            profession.$update(function(response) {
                if(response) {
                    $scope.init();
                }
            });
        };

        $scope.beforeSelect = function(professionField, profession) {
            if (professionField === 'roles') {
                profession.tmpRoles = profession.roles;
            }
        };

        $scope.showReagents = function(profession) {
            $scope.reagents = profession.reagents;
            $scope.selectedProfession = profession;
        };
    }
]);