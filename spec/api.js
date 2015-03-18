'use strict';

console.log('API TESTS STARTING:');

global.expect = require('chai').expect;

// let User = require(__dirname + '/../build/api/models/User.js');

describe('API', function () {
  // describe('ModelGenerator', function () {
  //   it('Should be a function', function () {
  //     expect(Model).to.be.a('function');
  //   });
  //   it('Should generate a class', function () {
  //     expect(Model('foobar')).to.be.a('function');
  //   });
  //   it('Which creates happy little objects', function () {
  //     expect(new (Model('foobar'))({
  //       someSpec: 'goes here'
  //     })).to.be.a('object');
  //   });
  // });
  describe('Models', function () {
    describe('Users', function () {
      // it('Should inherit things from Model', function () {
      //   let myUser = new User();
      //   expect(myUser.find).to.be.a('function');
      // });
    });
  });
});
