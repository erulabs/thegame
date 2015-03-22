/* global angular, document */
'use strict';

const GameClientLib = require('./game.js');

global.GAME = new GameClientLib();

angular.element(document).ready(function () {
  global.GAME.beginScene('login');
});
