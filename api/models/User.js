'use strict';

// const SharedUser = require(__dirname + '/../../shared/models/User.js');

module.exports = function (API) {
  /**
   * Represents a User - supports authentication
   * @constructor
   */
  let Schema = API.odm.Schema({
    username: {
      type: String,
      required: true,
      index: { unique: true }
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    registered: {
      type: Date,
      default: Date.now,
      required: true
    }
  });

  let User = API.odm.model('User', Schema);

  return User;

};
