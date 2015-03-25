'use strict';

module.exports = function (API) {

  class GameServerController {
    constructor() {
      API.app.post('/gameserver/register', function () {

      });
    }
  }
  return GameServerController;
};
