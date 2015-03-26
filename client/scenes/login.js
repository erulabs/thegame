/* global md5, Cookies */
'use strict';

module.exports = function (game) {

  const COOKIE_PREFIX = '_thegame_';
  let email = Cookies.get(`${COOKIE_PREFIX}_email`),
    sessionKey = Cookies.get(`${COOKIE_PREFIX}_sessionKey`),
    sessionExpires = Cookies.get(`${COOKIE_PREFIX}_sessionExpires`);

  /**
   * The LoginScene, which is mostly just a UI
   * Lets users login and register, obviously.
   * @constructor
   */
  class LoginScene {
    constructor() {
      this.name = 'login';
      this.visible = true;

    }
    init() {
      if (email !== undefined && sessionKey !== undefined && sessionExpires !== undefined) {
        this.autoLogin();
      } else {
        this.loginModal();
      }
    }
    tick() {

    }
    render() {

    }
  }

  //UI.controller('login', [ '$scope', '$http', '$cookies', '$cookieStore', '$location', '$modal',
    //function ($scope, $http, $cookies, $cookieStore, $location, $modal) {
  game.ui.controller('LoginCtrl', function ($scope, $modal, $http) {
    $scope.visible = game.sceneData.visible;

    let loginModal = false,
      registerModal = false;

    // Assuming they came with all the cookies, lets try to auth automatically
    LoginScene.prototype.autoLogin = function () {
      $http.post('/api/user/login', {
        email: email,
        sessionKey: sessionKey
      }).success(function (data) {
        console.log('auto login replied:', data);
        if (data.error) {
          Cookies.expire(`${COOKIE_PREFIX}_sessionKey`);
          Cookies.expire(`${COOKIE_PREFIX}_sessionExpires`);
          game.sceneData.loginModal();
          return false;
        } else {
          game.session = data.session;
          game.beginScene('test');
        }
      });
    };

    LoginScene.prototype.loginModal = function () {
      loginModal = $modal.open({
        templateUrl: 'loginModalContent',
        controller: 'LoginWindowCtrl',
        backdrop: false,
        keyboard: false
      });
    };
    LoginScene.prototype.registerModal = function () {
      registerModal = $modal.open({
        templateUrl: 'registerModalContent',
        controller: 'RegisterWindowCtrl',
        backdrop: false,
        keyboard: false
      });
    };
  });

  game.ui.controller('LoginWindowCtrl', function ($scope, $modalInstance, $http) {
    $scope.error = game.helpers.getParameterByName('loginError');
    $scope.regError = game.helpers.getParameterByName('regError');
    $scope.email = Cookies.get(`${COOKIE_PREFIX}_email`);
    $scope.login = function () {
      if ($scope.email === undefined || $scope.password === undefined) {
        $scope.error = 'Please enter an email and password';
        return false;
      }
      if ($scope.password.length < 5) {
        $scope.error = 'Password need to be longer than 5 characters in length';
        return false;
      }
      let md5Pass = md5($scope.password);
      $http.post('/api/user/login', {
        email: $scope.email,
        password: md5Pass
      }).success(function (data) {
        if (data.error) {
          $scope.error = data.error;
          return false;
        } else {
          game.session = data.session;
          Cookies.set(`${COOKIE_PREFIX}_email`, $scope.email);
          Cookies.set(`${COOKIE_PREFIX}_sessionKey`, game.session.key);
          Cookies.set(`${COOKIE_PREFIX}_sessionExpires`, game.session.expires);
          $modalInstance.close();
          game.beginScene('test');
        }
      });
    };
    $scope.register = function () {
      $scope.regError = undefined;
      $modalInstance.close();
      LoginScene.prototype.registerModal();
    };
  });


  game.ui.controller('RegisterWindowCtrl', function ($scope, $modalInstance, $http) {
    $scope.error = game.helpers.getParameterByName('regError');
    $scope.email = Cookies.get(`${COOKIE_PREFIX}_email`);
    $scope.register = function () {
      if ($scope.email === undefined ||
        $scope.password === undefined ||
        $scope.username === undefined ||
        $scope.cpassword === undefined) {
          $scope.error = 'Email, Username and Password required';
          return false;
      }
      if ($scope.password.length < 5) {
        $scope.error = 'Password need to be longer than 5 characters in length';
        return false;
      }
      if ($scope.password !== $scope.cpassword) {
        $scope.error = 'Passwords dont match!';
        return false;
      }
      $http.post('/api/user/register', {
        email: $scope.email,
        username: $scope.username,
        password: md5($scope.password)
      }).success(function (data) {
        if (data.error) {
          $scope.error = data.error;
          return false;
        } else {
          game.session = data.session;
          Cookies.set(`${COOKIE_PREFIX}_email`, $scope.email);
          Cookies.set(`${COOKIE_PREFIX}_sessionKey`, game.session.key);
          Cookies.set(`${COOKIE_PREFIX}_sessionExpires`, game.session.expires);
          $modalInstance.close();
          game.beginScene('test');
        }
      });
    };

    $scope.cancel = function () {
      $modalInstance.close();
      LoginScene.prototype.loginModal();
    };
  });

  return LoginScene;
};
