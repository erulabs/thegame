'use strict';

// Load configuration
const NODE_ENV = process.env.NODE_ENV || 'development',
  API_PORT = process.env.npm_package_config_API_PORT || 8000;

global.expect = require('chai').expect;
const Game = require(__dirname + '/../build/game/game.js');

console.log('GAME TESTS STARTING:');
describe('GAME', function () {
  it('it should create without issue', function () {
    let mock = new Game(NODE_ENV, API_PORT);
    expect(mock).to.be.a('object');
    expect(mock.listen).to.be.a('function');
  });
});
