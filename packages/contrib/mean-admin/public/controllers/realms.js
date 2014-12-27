'use strict';

angular.module('mean.mean-admin').controller('RealmsController', ['$scope', 'Global', 'Menus', '$rootScope', '$http', 'Realms',
    function($scope, Global, Menus, $rootScope, $http, Realms) {
      $scope.global = Global;

      $scope.regions = [
        {
          name: 'China',
          host: 'https://www.battlenet.com.cn/',
          locales: ['zh_CN']
        }, {
          name: 'Europe',
          host: 'https://eu.api.battle.net/',
          locales: ['en_GB','es_ES','fr_FR','ru_RU','de_DE','pt_PT','it_IT']
        }, {
          name: 'Korea',
          host: 'https://kr.api.battle.net/',
          locales: ['ko_KR']
        }, {
          name: 'Taiwan',
          host: 'https://tw.api.battle.net/',
          locales: ['zh_TW']
        }, {
          name: 'US',
          host: 'https://us.api.battle.net/',
          locales: ['en_US','es_MX','pt_BR']
        }];
      $scope.region = $scope.regions[4];

      $scope.locales = $scope.region.locales;
      $scope.locale = $scope.locales[0];

      $scope.init = function() {
        Realms.query({'host': $scope.region.host, 'locale': $scope.locale}, function(realms) {
          $scope.realms = realms;
          
          // get updated date from db
          angular.forEach($scope.realms, function(realm) {
            $http.get('/realm/'+realm.slug+'/'+realm.locale)
              .success(function(response) {
                if(response) {
                  realm.updated = response.updated;
                } else {
                  realm.updated = false;
                }
              });
          });
        });
      };

      $scope.selectRegion = function(region) {
        angular.forEach($scope.regions, function(object, index) {
          if(object.name === region.name) {
            $scope.region = object;
            $scope.locales = object.locales;
            $scope.locale = $scope.locales[0];
            $scope.init();
          }
        });
      };

      $scope.selectLocale = function(locale) {
        $scope.locale = locale;
        $scope.init();        
      };

      $scope.update = function(realm) {
        $http({method: 'POST', url: '/realm/auctions/download', data: {'host': $scope.region.host, 'locale': realm.locale, 'name': realm.slug} })
          .success(function(data) {
            if(data.length > 0) {
              realm.done = true;
              $http.get('/realm/'+realm.slug+'/'+realm.locale)
                .success(function(response) {
                  if(response) {
                    realm.updated = response.updated;
                  }
                });
            }
          })
          .error(function(data, status) {
            console.log(data, status);
          });
      };

  }]);