'use strict';

console.log('API TESTS STARTING:');

global.expect = require('chai').expect;

let API = require(__dirname + '/../build/api/api.js');
let instance = new API({
  NODE_ENV: 'test'
});

describe('API', function () {
  it('should create without issue', function () {
    expect(instance.listen).to.be.a('function');
  });
  it('should have loaded the User controller and model', function () {
    instance.init();
    expect(instance.models.User).to.be.a('function');
    expect(instance.controllers.User).to.be.a('object');
  });
});
