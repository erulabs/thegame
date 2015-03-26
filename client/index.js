/* global angular, document */
'use strict';

const GameClientLib = require('./game.js');

const Game = new GameClientLib();

angular.element(document).ready(function () {
  Game.beginScene('login');
});
