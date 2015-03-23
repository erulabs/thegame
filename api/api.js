/* global NODE_ENV */
'use strict';

/**
 * Represents an API.
 * @constructor
 */
class Api {
  constructor() {
    this.express = require('express');
    this.odm = require('mongoose');
    this.app = this.express();

    /** APIs loaded models will go here... eg: api.models.User... */
    this.models = {};
    /** APIs loaded controllers will go here */
    this.controllers = {};
  }

  /**
   * @description
   * Loads models and controller modules
   * @returns {undefined}
   */
  init() {
    let self = this;
    ['User'].forEach(function (model) {
      let Lib = require('./models/' + model + '.js');
      self.models[model] = Lib(self);
    });

    ['User'].forEach(function (controller) {
      let Lib = require('./controllers/' + controller + '.js')(self);
      self.controllers[controller] = new Lib();
    });
  }

  /**
   * @description
   * Attaches to the MongoDB database
   * @returns {undefined}
   */
  attachDB(DB_CONFIG, callback) {
    this.odm.connect(`mongodb://${DB_CONFIG.username}:${DB_CONFIG.password}@${DB_CONFIG.uri}`);
    this.db = this.odm.connection;
    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', callback);
  }

  /**
   * @description
   * Starts the express HTTP server
   * @returns {undefined}
   */
  listen(LISTEN_PORT) {
    // Start services
    console.log(`API starting. Env: "${NODE_ENV}". Listening on port: ${LISTEN_PORT}`);
    this.app.listen(LISTEN_PORT);
  }
}

module.exports = Api;
