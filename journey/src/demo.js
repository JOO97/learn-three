/**
 * @description Physics
 */
/**
 * 1. 3d物理库、2d物理库
 * 2. 在物理世界中创建threejs中对应的物体，从物理世界中获取到更新后的坐标，再赋值给threejs的物体
 * 3. physics 默认是在cpu中处理，使用worker，让physics在另一个线程中运行 https://schteppe.github.io/cannon.js/examples/worker.html
 * 4. cannon-es
 */

import * as THREE from 'three'
import { TetrahedronGeometry } from 'three'
import { gui, renderer, camera, scene, controls } from './init'

camera.position.y = 10
camera.position.z = 10
camera.position.x = 2
camera.fov = 60

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
