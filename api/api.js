/* global NODE_ENV */
'use strict';

/**
 * Represents an API.
 * @constructor
 */
class Api {
  constructor() {
    this.odm = require('mongoose');
    this.express = require('express');
    this.bcrypt = require('bcryptjs');

    this.app = this.express();
    let bodyParser = require('body-parser');
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());

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

  /**
   * @description
   * Encrypts a value
   * @returns {String}
   */
  encrypt(input, callback) {
    let self = this;
    self.bcrypt.genSalt(10, function(err, salt) {
      self.bcrypt.hash(input, salt, function(err, hash) {
        if (err) {
          console.log('Encryption error:', err);
          return false;
        }
        callback(hash);
      });
    });
  }

}

module.exports = Api;
