'use strict';

module.exports = function (API) {
  /**
   * Represents a Dispatcher - we store this in mongo so that multiple API servers can handle a single dispatcher
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

  let Dispatcher = API.odm.model('Dispatcher', Schema);

  return Dispatcher;

};
