/* global NODE_ENV */
'use strict';

/**
 * Represents an API.
 * @constructor
 */
class Api {
  constructor(config) {
    this.odm = require('mongoose');
    this.express = require('express');
    this.bcrypt = require('bcryptjs');
    this.uuid = require('node-uuid').v4;

    this.ENC_SALT = config.ENC_SALT;

    // ExpressJS setup
    this.app = this.express();
    let bodyParser = require('body-parser');
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());

    // Logger setup
    this.log = require('winston');

    /** APIs loaded models will go here... eg: api.models.User... */
    this.models = {};
    /** APIs loaded controllers will go here */
    this.controllers = {};

    /** Dispatchers we're currently controlling go here */
    this.dispatchers = {};
    /** Game servers we're currently controlling go here */
    this.gameServers = {};

    // Periodically health check the dispathcers and game servers if configured to do so
    if (config.healthCheckInterval) {
      setInterval(this.healthCheck.bind(this), config.healthCheckInterval);
    }
  }

  /**
   * @description
   * Loads models and controller modules
   * @returns {undefined}
   */
  init() {
    let self = this;
    // Load MODELS
    [ 'User',
      'GameServer',
      'Dispatcher'
    ].forEach(function (model) {
      let Lib = require('./models/' + model + '.js');
      self.models[model] = Lib(self);
    });
    // Load CONTROLLERS
    [ 'User',
      'GameServer',
      'Dispatcher'
    ].forEach(function (controller) {
      let Lib = require('./controllers/' + controller + '.js')(self);
      self.controllers[controller] = new Lib();
    });

    // TODO: Load dispatchers from database and try to contact them to re-register
    // TODO: Load gameservers from database and try to contact them via their dispatchers
  }

  /**
   * @description
   * Attaches to the MongoDB database
   * @returns {undefined}
   */
  attachDB(DB_CONFIG, callback) {
    let uri = `mongodb://${DB_CONFIG.uri}`;
    this.log.info(`Starting DB connection to ${uri}`);
    if (DB_CONFIG.username !== undefined && DB_CONFIG.password !== undefined) {
      uri = `mongodb://${DB_CONFIG.username}:${DB_CONFIG.password}@${DB_CONFIG.uri}`;
    }
    this.odm.connect(uri);
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
    this.log.info(`API starting. Env: "${NODE_ENV}". Listening on port: ${LISTEN_PORT}`);
    this.app.listen(LISTEN_PORT);
  }

  /**
   * @description
   * Encrypts a value
   * @returns {String}
   */
  encrypt(input, callback) {
    let self = this;
    self.bcrypt.hash(input, self.ENC_SALT, function(err, hash) {
      if (err) {
        self.log.info('Encryption error:', err);
        return false;
      }
      callback(hash);
    });
  }

  /**
   * @description
   * Checks the health of all Dispatchers and Game servers
   * Takes actions, like:
   *  1. telling dispatchers to spawn additional processes
   *  2. removing unhealthy/unresponsive dispatchers and game servers from the datastore
   *  3. updates the static health report
   * @returns {String}
   */
  healthCheck() {
    this.log.info(`API healthCheck beginning`);
    this.controllers.Dispatcher.healthCheckEvent();
  }
}

module.exports = Api;
