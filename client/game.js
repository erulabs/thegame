/* global angular, io, THREE, document, requestAnimationFrame, window */
'use strict';

/** load user model */
// const User = require('./models/User.js');
/** Interval in MS between game logic ticks */
const GAME_TICK_INTERVAL = 200;
global.UI = angular.module('thegame', ['ngCookies', 'ui.bootstrap']);

/** Represents a GameClient. */
class GameClient {
  /** GameClient Constructor */
  constructor() {
    let self = this;

    /**
     * The registry for scenes - due to the usage of Browserify
     * one cannot use dynamic paths - instead, include any scene files here
     */
    this.sceneRegistry = {
      'login': require('./scenes/login.js'),
      'test': require('./scenes/test.js')
    };

    /** The object for the current game scene data */
    this.sceneData = {
      render: function () {},
      tick: function() {},
      objects: {},
      name: 'loading'
    };

    /** The object for the current THREEJS Scene */
    this.scene = new THREE.Scene();

    /** The queue of tasks to run each render tick */
    this.renderTaskQueue = [];

    /** The queue of tasks to run each game tick */
    this.gameTaskQueue = [];

    /** create a camera so we can see the scene */
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1100);
    /** create a renderer for our scene */
    this.renderer = new THREE.WebGLRenderer();

    /** Set defaults camera position */
    this.camera.position.z = 80;
    this.camera.position.x = 80;
    this.camera.position.y = 80;

    /** add THREEjs OrbitControls to allow user to zoom and spin the board */
    this.controls = new THREE.OrbitControls(this.camera);

    /** Limit OrbitControls to sane angles to prevent looking at the bottom of the map. */
    this.controls.minPolarAngle = Math.PI / 8;
    this.controls.maxPolarAngle = Math.PI / 2.2;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 150;

    /** set the size of the renderer */
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    /** append renderer to the documents body */
    document.body.appendChild(this.renderer.domElement);

    /**
     * Resize the renderer and reproject the camera
     * when the browser window resizes
     * TODO: Test aspect ratio on different devices...
     * We may have to write some code that puts "black bars"
     * on the top or bottom of the screen to preserve aspect ratio
     */
    window.addEventListener('resize', function () {
      self.renderer.setSize(window.innerWidth, window.innerHeight);
      self.camera.aspect = window.innerWidth / window.innerHeight;
      self.camera.updateProjectionMatrix();
    });

    /**
     * The core render loop - is called as fast as the browser can call it
     * powered by the requestAnimationFrame API
     * @constructor
     * @returns {undefined}
     */
    var render = function () {
      // get the frame to render
      requestAnimationFrame(render);
      // render scene as seen through the camera
      self.renderer.render(self.scene, self.camera);
      // run renderFunctions
      self.renderTaskQueue.forEach(function (func) {
        func.call(self);
      });
      self.sceneData.render();
    };
    /** Begin rendering */
    render();

    /**
     * @description
     * The core game loop - is called evenly, once every GAME_TICK_INTERVAL ms
     * @returns {undefined}
     */
    function tick () {
      self.gameTaskQueue.forEach(function (func) {
        func.call(self);
      });
      self.sceneData.tick();
    }
    /** Begin ticking */
    setInterval(tick, GAME_TICK_INTERVAL);

  }

  /**
   * @description
   * Connects to a Game Server instance via SocketIO. Called once the API has found a Game Server for us to use.
   * @returns {undefined}
   */
  connect(GAME_SERVER_PORT) {
    // Start services
    const socket = io('http://localhost:' + GAME_SERVER_PORT);

    socket.on('connect', function () {
      console.log('connection');
    });
    socket.on('event', function (data) {
      console.log('data', data);
    });
    socket.on('disconnect', function () {
      console.log('disconnect');
    });
  }
  /**
   * @description
   * Changes to the desired scene - unloads assets, bindings, etc from previously loaded scene
   * @param {string} sceneKey The string identifier for the scene you wish to change to
   * @returns {undefined}
   */
  beginScene(sceneKey) {
    if (this.sceneRegistry[sceneKey] === undefined) {
      console.log(`Scene ${sceneKey} does not exist!`);
    } else {
      // TODO: Cleanup all objects here...
      console.log(`Beginning scene ${sceneKey}`);
      this.sceneData = new this.sceneRegistry[sceneKey](this);
    }
  }
}

module.exports = GameClient;
