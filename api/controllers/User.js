/* global encodeURIComponent */
'use strict';

module.exports = function (api) {
  const User = api.models.User;

  /**
   * User controller class
   * @constructor
   */
  class UserController {
    constructor() {
      let self = this;
      /** User login route */
      api.app.post('/user/login', function (req, res) {
        if (req.body.email !== undefined && req.body.sessionKey !== undefined) {
          self.userSessionLoginHandler(req, res);
        } else if (req.body.password === undefined ||
        req.body.email === undefined ||
        req.body.password === '' ||
        req.body.email === '') {
          let error = 'Email and password required';
          res.status(500).redirect('/?loginError=' + encodeURIComponent(error));
        } else if (req.body.password.length < 5) {
          let error = 'Password length insufficient';
          res.status(500).redirect('/?loginError=' + encodeURIComponent(error));
        } else {
          self.userLoginHandler(req, res);
        }
      });

      /** User register route */
      api.app.post('/user/register', this.userRegisterHandler);
    }
    /**
     * Handles user login requests via session keys
     * @constructor
     */
    userSessionLoginHandler(req, res) {
      console.log('looking for:', {
        email: req.body.email,
        sessionKey: req.body.sessionKey,
      });
      User.find({
        email: req.body.email,
        sessionKey: req.body.sessionKey,
      }, function (err, docs) {
        if (err) {
          api.log.warn('/user/login - User.find() error:', err);
        }
        // No one found
        if (docs.length === 0) {
          res.send({ error: true });
        // Matched a user, authenticate.
        } else {
          // TODO: Ensure key has not expired (req.body.sessionExpires)
          res.send({
            error: false,
            session: req.body.sessionKey
          });
        }
      });
    }

    /**
     * Handles user login requests
     * @constructor
     */
    userLoginHandler(req, res) {
      // Encrypt password given
      api.encrypt(req.body.password, function (password) {
        // Search for a user matching that email and encrypted password
        User.find({
          email: req.body.email,
          password: password
        }, function (err, docs) {
          if (err) {
            api.log.warn('/user/login - User.find() error:', err);
          }
          // No one found
          if (docs.length === 0) {
            let error = 'Invalid email / password';
            res.status(403).redirect('/?loginError=' + encodeURIComponent(error));
          // Matched a user, authenticate.
          } else {
            let newUser = docs[0];
            // Start a new session
            let session = newUser.startSession();
            // Save the new session to the database
            newUser.save(function (err) {
              if (err) {
                api.log.warn('/user/login - newUser.save() error:', err);
                res.status(403).redirect('/?loginError=' + encodeURIComponent('Unknown login error'));
              } else {
                // Reply back with the session information
                res.send({
                  error: false,
                  session: session
                });
              }
            });
          }
        });
      });
    }
    /**
     * Handles user login requests
     * @constructor
     */
    userRegisterHandler(req, res) {
      if (req.body.password === undefined ||
          req.body.email === undefined ||
          req.body.username === undefined ||
          req.body.password === '' ||
          req.body.email === '') {
        let error = 'Email, Username and Password required';
        return res.status(500).redirect('/?regError=' + encodeURIComponent(error));
      }
      if (req.body.password.length < 5) {
        let error = 'Password length insufficient';
        return res.status(500).redirect('/?regError=' + encodeURIComponent(error));
      }
      // Encrypt password given
      api.encrypt(req.body.password, function (password) {
        // Search for a user matching that email and encrypted password
        User.find({
          $or: [ { email: req.body.email }, { username: req.body.username } ]
        }, function (err, docs) {
          if (err) {
            api.log.warn('/user/register - User.find() error:', err);
          }
          // No one found, register
          if (docs.length === 0) {
            // Create the new user instance
            let newUser = new User({
              username: req.body.username,
              email: req.body.email,
              password: password
            });
            // Start a new session
            let session = newUser.startSession();
            // Save the model to the database
            newUser.save(function (err) {
              if (err) {
                api.log.warn('/user/register - newUser.save() error:', err);
                res.status(403).redirect('/?regError=' + encodeURIComponent('Unknown registration error'));
              } else {
                // Reply back with the session information
                res.send({
                  error: false,
                  session: session
                });
              }
            });
          // Matched an existing user, reject
          } else {
            let error = 'Sorry, that email or username is already taken';
            res.status(403).redirect('/?regError=' + encodeURIComponent(error));
          }
        });
      });
    }
  }

  return UserController;

};
