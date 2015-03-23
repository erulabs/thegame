/* global UI, GAME */
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
});

UI.controller('LoginWindowCtrl', function ($scope, $modal, $modalInstance, $http) {
  $scope.login = function () {
    $modalInstance.close();
    $http.post('/api/user/login', {
      username: $scope.username,
      password: $scope.password
    }).success(function (data, status) {
      console.log(status, data);
    });
    global.GAME.beginScene('test');
  };
  $scope.register = function () {
    $modalInstance.close();
    LoginScene.prototype.registerModal();
  };
});


UI.controller('RegisterWindowCtrl', function ($scope, $modalInstance) {
  $scope.cancel = function () {
    $modalInstance.close();
    LoginScene.prototype.loginModal();
  };
});

module.exports = LoginScene;
