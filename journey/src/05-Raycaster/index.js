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

/**
 * objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
const object2 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
const object3 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
object1.position.set(-2, 0, 0)
object3.position.set(2, 0, 0)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
const rayOrigin = new THREE.Vector3(-3, 0, 0) //起始位置
const rayDirection = new THREE.Vector3(1, 0, 0) //投射方向
rayDirection.normalize() //将向量长度标准化为1

raycaster.set(rayOrigin, rayDirection)

/**
 * test objects
 */

const intersect = raycaster.intersectObject(object1)
const intersects = raycaster.intersectObjects([object1, object2, object3])

console.log('intersect', intersect, intersects)

scene.add(
  new THREE.AxesHelper(100),
  new THREE.ArrowHelper(rayDirection, rayOrigin, 10),
  object1,
  object2,
  object3
)
/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
})

/**
 * animates
 */
let clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  /**
   * animate objects
   */
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
  object3.position.y = Math.sin(elapsedTime * 1.5) * 1.5

  const raycaster = new THREE.Raycaster()
  /**
   * Cast a Ray
   */
  // const rayOrigin = new THREE.Vector3(-3, 0, 0) //起始位置
  // const rayDirection = new THREE.Vector3(10, 0, 0) //投射方向
  // rayDirection.normalize() //将向量长度标准化为1
  // raycaster.set(rayOrigin, rayDirection)

  /**
   * Cast Ray by Mouse
   */
  raycaster.setFromCamera(mouse, camera)

  const objects = [object1, object2, object3]
  const intersects = raycaster.intersectObjects(objects)
  objects.forEach((item) => {
    item.material.color = new THREE.Color(0xff0000)
  })

  intersects.forEach((item) => {
    item.object.material.color = new THREE.Color(0x00ff00)
  })

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
