'use strict';

// const SharedUser = require(__dirname + '/../../shared/models/User.js');

module.exports = function (API) {
  /**
   * Represents a User - supports authentication
   * This is a test of the auto-doc system
   * @constructor
   */
  let Schema = API.odm.Schema({
    name: String,
    password: String
  });

  let User = API.odm.model('User', Schema);

  return User;

};
