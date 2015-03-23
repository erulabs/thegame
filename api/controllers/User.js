/* global API */
'use strict';

module.exports = function (API) {
  const User = API.models.User;

  /**
   * User controller class
   * @constructor
   */
  class UserController {
    constructor() {
      API.app.post('/user/login', function (req, res) {
        let userLogin = new User();
        userLogin.save();
        res.send('Hello testy world - Proof!');
      });
    }
  }

  return UserController;

};
