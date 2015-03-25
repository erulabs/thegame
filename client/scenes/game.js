/* global UI, GAME */
'use strict';

/**
 * Represents a GameScene.
 * @constructor
 */
class GameScene {
  constructor() {
    this.name = 'game';
    this.chatVisible = true;
    this.objects = {};
  }
  init() {
  }
  /**
   * @description
   * The core render loop - is called as fast as the browser can call it
   * powered by the requestAnimationFrame API
   * @returns {undefined}
   */
  render() {

  }

  /**
   * @description
   * The core game loop - is called evenly, once every GAME_TICK_INTERVAL ms
   * @returns {undefined}
   */
  tick() {
  }
}

UI.controller('ChatCtrl', function ($scope) {
  $scope.visible = GAME.sceneData.chatVisible;
});

module.exports = GameScene;
