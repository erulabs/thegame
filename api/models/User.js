'use strict';

// const SharedUser = require(__dirname + '/../../shared/models/User.js');

module.exports = function (api) {
  /**
   * Represents a User - supports authentication
   * @constructor
   */
  let Schema = api.odm.Schema({
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
    },
    sessionKey: {
      type: String
    },
    sessionExpires: {
      type: Date
    }
  });

  let User = api.odm.model('User', Schema);

  /**
   * Generates a new session key, updates the database and returns with the new key and expiration date
   */
  User.prototype.startSession = function () {
    let self = this;
    self.sessionKey = api.uuid();
    self.sessionExpires = Date.now();
    return {
      key: self.sessionKey,
      expires: self.sessionExpires
    };
  };

  return User;
};
