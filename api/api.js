/* global NODE_ENV */
'use strict';

const express = require('express'),
  User = require('./models/User.js'),
  testUser = new User();
testUser.save();

/**
 * Represents an API.
 * @constructor
 */
class Api {
  constructor(NODE_ENV) {
    this.NODE_ENV = NODE_ENV;

    this.app = express();

    this.app.get('/test', function (req, res) {
      res.send('Hello testy world - Proof!');
    });
  }
  listen(LISTEN_PORT) {
    // Start services
    console.log(`API starting. Env: "${NODE_ENV}". Listening on port: ${LISTEN_PORT}`);
    this.app.listen(LISTEN_PORT);
  }
}

module.exports = Api;
