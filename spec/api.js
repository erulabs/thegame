'use strict';

console.log('API TESTS STARTING:');

global.expect = require('chai').expect;

let User = require(__dirname + '/../build/api/models/User.js'),
  base = require(__dirname + '/../build/api/models/base.js');

describe('API', function () {
  describe('Base model', function () {
    it('should have the base model functionality', function () {
      expect(base).to.be.a('object');
      expect(base._extend).to.be.a('function');
      expect(base.model.save).to.be.a('function');
    });
  });
  describe('Models', function () {
    describe('Users', function () {
      it('should create without issue', function () {
        let myUser = new User();
        expect(myUser.username).to.be.a('string');
        expect(myUser.save).to.be.a('function');
      });
    });
  });
});
