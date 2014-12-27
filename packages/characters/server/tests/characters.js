/* jshint -W079 */ 
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
	mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Character = mongoose.model('Character');

/**
 * Globals
 */
var user;
var character;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model Character:', function() {
    beforeEach(function(done) {
      user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password'
      });

      user.save(function() {
        character = new Character({
          name: 'Healvetica',
          realm: 'Sargeras',
          user: user
        });

        done();
      });
    });

    describe('Method Save', function() {
      it('should be able to save without problems', function(done) {
        return character.save(function(err) {
          expect(err).to.be(null);
          expect(character.name).to.equal('Healvetica');
          expect(character.realm).to.equal('Sargeras');
          expect(character.user.length).to.not.equal(0);
          done();
        });
      });

      it('should be able to show an error when try to save without user', function(done) {
        character.user = {};

        return character.save(function(err) {
          expect(err).to.not.be(undefined);
          done();
        });
      });

    });

    afterEach(function(done) {
      character.remove(function () {
        user.remove(done);
      });
    });
  });
});
