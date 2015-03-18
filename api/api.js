/* global NODE_ENV */
'use strict';

const express = require('express'),
  webhook = require('github-webhook'),
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

    let GITHUB_PORT = 9001;
    webhook({
      'port': GITHUB_PORT,
      'path': '/webhook',
      'secret': '074d3b3d0c57ca261f69af82',
      'log': '~/webhook.log',
      'rules': [{
        'event': 'push',
        'match': 'ref == "refs/heads/staging" && repository.name == "thegame"',
        'exec': 'sudo /usr/bin/salt \* state.sls thegame'
      }]
    }).listen(GITHUB_PORT);
  }
}

module.exports = Api;
