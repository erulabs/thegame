/* global UI, GAME */
'use strict';

UI.controller('login', [ '$scope', '$http', '$cookies', '$cookieStore', '$location', '$modal',
  //function ($scope, $http, $cookies, $cookieStore, $location, $modal) {
  function ($scope) {
    $scope.visible = GAME.sceneData.visible;
  }
]);

/**
 * Represents a LoginScene.
 * @constructor
 */
class LoginScene {
  constructor() {
    this.name = 'login';
    this.visible = false;
  }
  tick() {

  }
  render() {

  }
}

module.exports = LoginScene;
