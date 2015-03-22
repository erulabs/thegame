'use strict';

// Load libraries
const Socketio = require('socket.io');

/**
 * Represents a GameServer.
 * @constructor
 */
class GameServer {
  constructor(NODE_ENV, API_PORT) {
    let self = this;
    this.NODE_ENV = NODE_ENV;
    this.API_PORT = API_PORT;
    self.io = new Socketio();

    self.io.on('connection', function () {
      self.io.emit('init', { test: 'foobar' });
    });
  }

  /**
   * @description
   * Starts the GameServers SocketIO instance
   * @returns {undefined}
   */
  listen(GAME_PORT) {
    let self = this;
    console.log(`Game Server starting. Env: "${this.NODE_ENV}". Listening on port: ${GAME_PORT}`);
    self.io.attach(GAME_PORT);
  }
}

module.exports = GameServer;
