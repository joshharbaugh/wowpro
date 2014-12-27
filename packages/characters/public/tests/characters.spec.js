'use strict';

(function() {
  // Characters Controller Spec
  describe('MEAN controllers', function() {
    describe('CharactersController', function() {
      // The $resource service augments the response object with methods for updating and deleting the resource.
      // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
      // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
      // When the toEqualData matcher compares two objects, it takes only object properties into
      // account and ignores methods.
      beforeEach(function() {
        jasmine.addMatchers({
          toEqualData: function() {
            return {
              compare: function(actual, expected) {
                return {
                  pass: angular.equals(actual, expected)
                };
              }
            };
          }
        });
      });

      beforeEach(function() {
        module('mean');
        module('mean.system');
        module('mean.characters');
      });

      // Initialize the controller and a mock scope
      var CharactersController,
        scope,
        $httpBackend,
        $stateParams,
        $location;

      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

        scope = $rootScope.$new();

        CharactersController = $controller('CharactersController', {
          $scope: scope
        });

        $stateParams = _$stateParams_;

        $httpBackend = _$httpBackend_;

        $location = _$location_;

      }));

      it('$scope.find() should create an array with at least one article object ' +
        'fetched from XHR', function() {

          // test expected GET request
          $httpBackend.expectGET('characters').respond([{
            name: 'Healvetica',
            realm: 'Sargeras'
          }]);

          // run controller
          scope.find();
          $httpBackend.flush();

          // test scope value
          expect(scope.characters).toEqualData([{
            name: 'Healvetica',
            realm: 'Sargeras'
          }]);

        });

      it('$scope.findOne() should create an array with one character object fetched ' +
        'from XHR using a characterId URL parameter', function() {
          // fixture URL parament
          $stateParams.characterId = '525a8422f6d0f87f0e407a33';

          // fixture response object
          var testCharacterData = function() {
            return {
              name: 'Healvetica',
              realm: 'Sargeras'
            };
          };

          // test expected GET request with response object
          $httpBackend.expectGET(/characters\/([0-9a-fA-F]{24})$/).respond(testCharacterData());

          // run controller
          scope.findOne();
          $httpBackend.flush();

          // test scope value
          expect(scope.character).toEqualData(testCharacterData());

        });
    });
  });
}());
