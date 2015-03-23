/* global encodeURIComponent */
'use strict';

module.exports = function (API) {
  const User = API.models.User;

  /**
   * User controller class
   * @constructor
   */
  class UserController {
    constructor() {

      /** User login route */
      API.app.post('/user/login', function (req, res) {
        if (req.body.password === undefined ||
            req.body.email === undefined ||
            req.body.password === '' ||
            req.body.email === '') {
          let error = 'Email and password required';
          return res.status(500).redirect('/?loginError=' + encodeURIComponent(error));
        }
        if (req.body.password.length < 5) {
          let error = 'Password length insufficient';
          return res.status(500).redirect('/?loginError=' + encodeURIComponent(error));
        }
        // Encrypt password given
        API.encrypt(req.body.password, function (password) {
          // Search for a user matching that email and encrypted password
          User.find({
            email: req.body.email,
            password: password
          }, function (err, docs) {
            if (err) {
              console.log('/user/login - User.find() error:', err);
            }
            // No one found
            if (docs.length === 0) {
              let error = 'Invalid email / password';
              res.status(403).redirect('/?loginError=' + encodeURIComponent(error));
            // Matched a user, authenticate.
            } else {
              res.status(200).set({
                'token': 'SOME_AUTH_TOKEN'
              }).redirect('/');
            }
          });
        });
      });
    }
  }

  return UserController;

};
