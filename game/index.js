'use strict';

// Load configuration
const NODE_ENV = process.env.NODE_ENV || 'development',
  API_PORT = process.env.npm_package_config_API_PORT || 8000,
  GAME_PORT_START = process.env.npm_package_config_GAME_PORT_START || 8003;

const GameServerLib = require('./game.js');
const GameServer = new GameServerLib(NODE_ENV, API_PORT, GAME_PORT_START);

GameServer.listen(GAME_PORT_START);

// Load models
// let User = require('./models/User.js');
