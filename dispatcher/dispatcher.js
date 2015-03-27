/* global NODE_ENV */
'use strict';

/**
 * Represents a Dispatcher.
 * The Dispatcher is responsible for spawning GameServers and for reporting its health
 * and the health of its children to the API.
 * @constructor
 */
class Dispatcher {
  constructor(options) {
    this.API_URI = options.API_URI;
    this.DISPATCHER_PORT = options.DISPATCHER_PORT;
    this.express = require('express');
    this.app = this.express();
    this.request = require('request');

    // Logger setup
    this.log = require('winston');

    this.app.get('/healthCheck', this.healthCheckHandler);
  }

  /**
   * @description
   * Connects to the API and registers itsself
   * @returns {undefined}
   */
  register() {
    let self = this;
    // Incoming hook for API to test functionality
    self.app.post('/apiTest', function (req, res) {
      res.status(200).send('OK');
    });
    self.request.post(`${this.API_URI}/dispatcher/register`, {
      form: {
        DISPATCHER_PORT: self.DISPATCHER_PORT
      }
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        self.log.info('Dispatcher registered successfully');
      } else {
        self.log.warn(`API REGISTER REQUEST FAILED - reply was: ${body}`, error);
      }
    });
  }

  /**
   * @description
   * Starts the Dispatchers HTTP server
   * @returns {undefined}
   */
  listen() {
    this.log.info(`Dispatcher starting. Env: "${NODE_ENV}". Listening on port: ${this.DISPATCHER_PORT}`);
    this.app.listen(this.DISPATCHER_PORT);
  }

  /**
   * @description
   * Starts the Dispatchers HTTP server
   * @returns {undefined}
   */
  spawnGame() {

  }

  /**
   * @description
   * Reports on the dispatchers health
   * @returns {undefined}
   */
  healthCheckHandler(req, res) {
    res.send('Hello testy world - Proof!');
  }
}
module.exports = Dispatcher;
