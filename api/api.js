/* global NODE_ENV */
'use strict';

/**
 * Represents an API.
 * @constructor
 */
class Api {
  constructor() {
    let self = this;
    global.API = self;

    this.express = require('express');
    this.app = this.express();

    this.models = {};
    ['User'].forEach(function (model) {
      self.models[model] = require('./models/' + model + '.js');
    });

    this.controllers = {};
    ['User'].forEach(function (controller) {
      let Lib = require('./controllers/' + controller + '.js');
      self.controllers[controller] = new Lib();
    });

  }
  listen(LISTEN_PORT) {
    // Start services
    console.log(`API starting. Env: "${NODE_ENV}". Listening on port: ${LISTEN_PORT}`);
    this.app.listen(LISTEN_PORT);
  }
}

module.exports = Api;
