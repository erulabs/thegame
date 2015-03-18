/* global THREE, GAME */
'use strict';

/**
 * Represents a TestScene.
 * @constructor
 */
class TestScene {
  constructor() {
    this.name = 'test';
    this.objects = {};
    // create a geometry for the placeholder cube
    const geometry = new THREE.BoxGeometry( 10, 10, 10, 10, 10, 1 );
    // create THREEjs mesh from geometry and material
    const texture = new THREE.ImageUtils.loadTexture( 'assets/crate.png' );
    // improves texture sharpness/sampling
    texture.anisotropy = GAME.renderer.getMaxAnisotropy();
    const cratemat = new THREE.MeshBasicMaterial( { map: texture } );
    this.objects.crate = new THREE.Mesh( geometry, cratemat );

    ////////// SKYBOX ////////////////////////
    const skyimgs = [
      'assets/crate.png',
      'assets/crate2.png',
      'assets/crate.png',
      'assets/crate.png',
      'assets/side.png',
      'assets/side.png'
    ];

    const cubemap = THREE.ImageUtils.loadTextureCube(skyimgs); // load textures
    cubemap.format = THREE.RGBFormat;

    const shader = THREE.ShaderLib.cube; // init cube shader from built-in lib
    shader.uniforms.tCube.value = cubemap; // apply textures to shader

    // create shader material
    const skyBoxMaterial = new THREE.ShaderMaterial( {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    });

    // create skybox mesh
    const skybox = new THREE.Mesh(
      new THREE.CubeGeometry(1000, 1000, 1000),
      skyBoxMaterial
    );

    // FLOOR
    const materials = [
       new THREE.MeshBasicMaterial({
        //front-right-side
           map: THREE.ImageUtils.loadTexture('assets/side.png')
       }),
       //
       new THREE.MeshBasicMaterial({
           map: THREE.ImageUtils.loadTexture('assets/side.png')
       }),
        //TOP FACE
       new THREE.MeshBasicMaterial({
           map: THREE.ImageUtils.loadTexture('assets/top.png')
       }),
       new THREE.MeshBasicMaterial({
           map: THREE.ImageUtils.loadTexture('assets/side.png')
       }),
        //front-left-side
       new THREE.MeshBasicMaterial({
           map: THREE.ImageUtils.loadTexture('assets/side.png')
       }),
       new THREE.MeshBasicMaterial({
           map: THREE.ImageUtils.loadTexture('assets/side.png')
       })
    ];
    const floor = new THREE.Mesh(
        new THREE.BoxGeometry( 100, 3, 100, 1, 1, 1 ),
        new THREE.MeshFaceMaterial( materials ) );

    // testing cube using floor objects and materials
    const colorcube = new THREE.Mesh(
        new THREE.BoxGeometry( 10, 10, 10, 1, 1, 1 ),
        new THREE.MeshFaceMaterial( materials ) );

    // const floortex = new THREE.ImageUtils.loadTexture( 'assets/crate2.png' );
    // floortex.anisotropy = renderer.getMaxAnisotropy();
    // const floormat = new THREE.MeshBasicMaterial( { map: floortex } );
    // const floor = new THREE.Mesh( floorgeo, floormat );

    GAME.scene.add( skybox, this.objects.crate, floor, colorcube );

    // asset default position
    floor.position.y = -6.5;
    this.objects.crate.position.x = -20;
    this.objects.crate.position.z = -20;
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
    this.objects.crate.rotation.x += 20;
  }
}

module.exports = TestScene;
