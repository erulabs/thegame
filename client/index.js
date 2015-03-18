'use strict';

const GameClientLib = require('./game.js');

global.GAME = new GameClientLib();

global.GAME.beginScene('test');
