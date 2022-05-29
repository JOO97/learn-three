/**
 * @description Shader Patterns
 */

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { gui, renderer, camera, scene, controls, directionLight } from './init'

//shader
import vertexShader from './shaders/test/vertex.glsl'
import fragmentShader from './shaders/test/fragment.glsl'

/**
 * texture
 */
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('/assets/models/duck/DuckCM.png')

/**
 * ShaderMaterial 在着色器中不要定义一些内置的变量
 */
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {},
  transparent: true
  // wireframe: true
})

const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)

const plane = new THREE.Mesh(geometry, material)
plane.scale.y = 2 / 3
// plane.rotation.x = -Math.PI / 2
// plane.receiveShadow = true
console.log('geometry', geometry)

directionLight.shadow.camera.far = 30
directionLight.shadow.mapSize.set(1024, 1024)
scene.add(new THREE.AxesHelper(100), plane)

/**
 * animates
 */
let clock = new THREE.Clock()
let prev = 0
function animate() {
  const elapsedTime = clock.getElapsedTime()
  const delta = elapsedTime - prev
  prev = elapsedTime

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
