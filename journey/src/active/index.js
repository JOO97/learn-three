/**
 * @description Raycaster
 */

import * as THREE from 'three'
import { TetrahedronGeometry } from 'three'
import { gui, renderer, camera, scene, controls } from './init'

camera.position.y = 0
camera.position.z = 4
camera.position.x = 0
camera.fov = 30

/**
 * texture
 */
const textureLoader = new THREE.TextureLoader()

scene.add(new THREE.AxesHelper(100))

/**
 * animates
 */
let clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
