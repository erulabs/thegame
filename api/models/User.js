'use strict';

const BaseModel = require('./base.js'),
  SharedUser = require(__dirname + '/../../shared/models/User.js');

/**
 * Represents a User - supports authentication
 * This is a test of the auto-doc system
 * @constructor
 */
class User extends SharedUser {
  constructor() {
    this.username = 'someValue';
  }
}

BaseModel._extend(User);

module.exports = User;
