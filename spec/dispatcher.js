'use strict';

console.log('DISPATCHER TESTS STARTING:');

global.expect = require('chai').expect;

const Dispatcher = require(__dirname + '/../build/dispatcher/dispatcher.js');

describe('Dispatcher', function () {
  it('it should create without issue', function () {
    let mock = new Dispatcher({
      API_URI: 'http://localhost:8000'
    });
    expect(mock).to.be.a('object');
    expect(mock.register).to.be.a('function');
    expect(mock.listen).to.be.a('function');
    expect(mock.spawnGame).to.be.a('function');
    expect(mock.healthCheckHandler).to.be.a('function');
  });
});

