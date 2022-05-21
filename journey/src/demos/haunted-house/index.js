/**
 * @description Haunted House
 */

import * as THREE from 'three'
import { gui, renderer, camera, scene, controls } from './init'

camera.position.y = 4
camera.position.z = 10
camera.position.x = 0
camera.fov = 20

/**
 * plane
 */
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    color: 0x95ab78
  })
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = 0

/**
 * sphere
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.7
  })
)
sphere.position.y = 1

/**
 * house
 */
const house = new THREE.Group()

const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    color: 0xac8e82
  })
)
walls.position.y = 2.5 / 2

const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0xb35f45 })
)
roof.position.y = 2.5 + 0.5
roof.rotation.y = Math.PI / 4

const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.5, 2),
  new THREE.MeshStandardMaterial({ color: 0xaa7b7a })
)
door.position.z = 2.01
door.position.y = 1

/**
 * Bushes
 */
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.z = 2 + 0.5
bush1.position.x = 1
bush1.position.y = 0.15

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.2, 0.2, 0.2)
bush2.position.z = 2 + 0.5
bush2.position.x = 1.6
bush2.position.y = 0.15

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.z = 2 + 0.5
bush3.position.x = -1
bush3.position.y = 0.15

/**
 * door light
 */
const doorLight = new THREE.PointLight(0xdd7d46, 1, 7)
doorLight.position.set(0, 2.6, 2.7)

house.add(walls, roof, door, bush1, bush2, bush3, doorLight)

/**
 * Graves
 */
const graves = new THREE.Group()
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 })

for (let index = 0; index < 50; index++) {
  const mesh = new THREE.Mesh(graveGeometry, graveMaterial)
  const angle = Math.random() * Math.PI * 2
  const distance = 3 + Math.random() * 6 //保证距离在3-9之间
  const x = Math.cos(angle) * distance
  const z = Math.sin(angle) * distance
  mesh.position.set(x, 0.3, z)
  mesh.rotation.y = (Math.random() - 0.5) * 0.4
  mesh.rotation.z = (Math.random() - 0.5) * 0.4
  mesh.castShadow = true
  graves.add(mesh)
}

/**
 * Fog
 */
const fog = new THREE.Fog(0x262837, 1, 15)
scene.fog = fog

renderer.setClearColor(0x262837)

/**
 * Ghost
 */
const ghost1 = new THREE.PointLight(0x00ffff, 2, 3)
const ghost2 = new THREE.PointLight(0xff00ff, 2, 3)
const ghost3 = new THREE.PointLight(0xffff00, 2, 3)

scene.add(new THREE.AxesHelper(100), plane, house, graves, ghost1, ghost2, ghost3)

/**
 * shadow
 */
renderer.shadowMap.enabled = true

doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true

plane.receiveShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * animate
 */
let clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  /**
   * update ghost
   */
  const angel = elapsedTime * 0.5
  ghost1.position.set(Math.cos(angel) * 5, Math.sin(elapsedTime * 3), Math.sin(angel) * 5)
  ghost2.position.set(
    Math.cos(-angel * 0.5) * 4,
    Math.sin(elapsedTime * 5),
    Math.sin(-angel * 0.5) * 4
  )
  ghost3.position.set(
    Math.cos(-angel * 0.25) * 7,
    Math.sin(elapsedTime * 5),
    Math.sin(-angel * 0.25) * 7
  )
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
