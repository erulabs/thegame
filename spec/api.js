'use strict';

console.log('API TESTS STARTING:');

global.expect = require('chai').expect;

let API = require(__dirname + '/../build/api/api.js');
let instance = new API({
  NODE_ENV: 'test'
});

describe('API', function () {
  instance.init();
  it('should create without issue', function () {
    expect(instance.listen).to.be.a('function');
    expect(instance.attachDB).to.be.a('function');
    expect(instance.models).to.be.a('object');
    expect(instance.controllers).to.be.a('object');
  });
  it('should have loaded the User controller and model', function () {
    expect(instance.models.User).to.be.a('function');
    expect(instance.controllers.User).to.be.a('object');
  });
});
