/* global UI, GAME, md5 */
'use strict';

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
    this.loginModal();
  }
  tick() {

  }
  render() {

  }
}

//UI.controller('login', [ '$scope', '$http', '$cookies', '$cookieStore', '$location', '$modal',
  //function ($scope, $http, $cookies, $cookieStore, $location, $modal) {
UI.controller('LoginCtrl', function ($scope, $modal) {
  $scope.visible = GAME.sceneData.visible;

  LoginScene.prototype.loginModal = function () {
    $modal.open({
      templateUrl: 'loginModalContent',
      controller: 'LoginWindowCtrl',
      backdrop: false,
      keyboard: false
    });
  };
  LoginScene.prototype.registerModal = function () {
    $modal.open({
      templateUrl: 'registerModalContent',
      controller: 'RegisterWindowCtrl',
      backdrop: false,
      keyboard: false
    });
  };
  $scope.loginScene = new LoginScene();
  $scope.loginShow = true;
});

UI.controller('LoginWindowCtrl', function ($scope, $modal, $modalInstance, $http) {
  $scope.error = UI.getParameterByName('loginError');
  $scope.login = function () {
    if ($scope.email === undefined || $scope.password === undefined) {
      $scope.error = 'Please enter an email and password';
      return false;
    }
    if ($scope.password.length < 5) {
      $scope.error = 'Password need to be longer than 5 characters in length';
      return false;
    }
    $http.post('/api/user/login', {
      email: $scope.email,
      // MD5 the password... We do this so that, even in local development
      // or when mistakenly not using HTTPS, we'll still at least not -plaintext- passwords.
      // Not perfect, but it's fully worth the small cost involved.
      password: md5($scope.password)
    }).success(function (data, status) {
      console.log(status, data);
      $scope.error = data;
      $scope.loginShow = !$scope.loginShow;
      //$modalInstance.close();
      //global.GAME.beginScene('test');
    });
  };
  $scope.register = function () {
    $modalInstance.close();
    LoginScene.prototype.registerModal();
  };
  $scope.cancel = function () {
    $modalInstance.close();
  };
});


UI.controller('RegisterWindowCtrl', function ($scope, $modalInstance) {
  $scope.cancel = function () {
    $modalInstance.close();
    LoginScene.prototype.loginModal();
  };
});

module.exports = LoginScene;


