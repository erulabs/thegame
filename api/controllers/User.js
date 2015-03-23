/* global API */
'use strict';

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

module.exports = UserController;
