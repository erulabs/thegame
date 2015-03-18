/* global NODE_ENV */
'use strict';

/** Load libraries */
// const spawn = require('child_process').spawn;
const express = require('express'),
  request = require('request');

//IOJS_OPTIONS = ['--harmony_classes', '--use_strict', '--es_staging'];

/**
 * Represents a Dispatcher.
 * The Dispatcher is responsible for spawning GameServers and for reporting its health
 * and the health of its children to the API.
 * @constructor
 */
class Dispatcher {
  constructor(options) {
    this.API_URI = options.API_URI;
    this.app = express();

    this.app.get('/test', function (req, res) {
      res.send('Hello testy world - Proof!');
    });
  }

  /**
   * @description
   * Connects to the API and registers itsself
   * @returns {undefined}
   */
  register() {
    request(`${this.API_URI}/test`, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(body);
      }
    });
  }

  /**
   * @description
   * Starts the Dispatchers HTTP server
   * @returns {undefined}
   */
  listen(DISPATCHER_PORT) {
    console.log(`Dispatcher starting. Env: "${NODE_ENV}". Listening on port: ${DISPATCHER_PORT}`);
    this.app.listen(DISPATCHER_PORT);
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
  health() {

  }
}
module.exports = Dispatcher;
