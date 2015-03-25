'use strict';

module.exports = function (API) {
  /**
   * Represents a GameServer - we store this in mongo so that multiple API servers can handle a single GameServer
   * That's scale, folks.
   * @constructor
   */
  let Schema = API.odm.Schema({
    uri: {
      type: String,
      required: true,
      index: { unique: true }
    }
  });

  let GameServer = API.odm.model('GameServer', Schema);

  return GameServer;

};
