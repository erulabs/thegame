'use strict';

// Tracks the logged in user, their stats, current game etc.

let UserSpec = require('./../../shared/models/User.js');

let User = Object.create(UserSpec);

module.exports = User;
