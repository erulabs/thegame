'use strict';

module.exports = function (api) {

  class GameServerController {
    constructor() {
      api.app.post('/gameserver/register', function () {

      });
    }
  }
  return GameServerController;
};
