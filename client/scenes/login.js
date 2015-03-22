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
UI.controller('LoginCtrl', [ '$scope', '$modal',
  function ($scope, $modal) {
    $scope.visible = GAME.sceneData.visible;

    LoginScene.prototype.loginModal = function () {
      $modal.open({
        templateUrl: 'loginModalContent',
        controller: 'LoginWindowCtrl'
      });
    };
  }
]);

UI.controller('LoginWindowCtrl', function ($scope, $modalInstance) {
  $scope.login = function () {
    $modalInstance.close();
    global.GAME.beginScene('test');
  };
  $scope.register = function () {
    $modalInstance.close();
    global.GAME.beginScene('test');
  };
});

module.exports = LoginScene;
