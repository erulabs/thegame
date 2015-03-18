'use strict';

// Load libraries
const socketio = require('socket.io');

/**
 * Represents a GameServer.
 * @constructor
 */
class GameServer {
  constructor(NODE_ENV, API_PORT, GAME_PORT) {
    let io = socketio(GAME_PORT);
    console.log(`Game Server starting. Env: "${NODE_ENV}". Listening on port: ${GAME_PORT}`);

    io.on('connection', function () {
      io.emit('init', { test: 'foobar' });
    });
  }

  /**
   * @description
   * Starts the GameServers SocketIO instance
   * @returns {undefined}
   */
  listen() {

  }
}

module.exports = GameServer;
