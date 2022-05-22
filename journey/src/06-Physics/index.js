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

import CANNON from 'cannon'
console.log('CANNON', CANNON)

camera.position.y = 10
camera.position.z = 10
camera.position.x = 2
camera.fov = 60

/**
 * texture
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Plane
 */
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0x403f3f })
)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
/**
 * Sphere
 */
// const sphere = new THREE.Mesh(
//   new THREE.SphereBufferGeometry(0.5, 16, 16),
//   new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 })
// )
// sphere.position.y = 0.5
// sphere.castShadow = true

/**
 * Physics Cannon
 */

//world
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

//性能优化
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true // 对不不在运动的物体进行物理测试

//material
const concreteMaterial = new CANNON.Material('concrete')
const plasticMaterial = new CANNON.Material('plastic')
const concretePlasticMaterial = new CANNON.ContactMaterial(concreteMaterial, plasticMaterial, {
  friction: 0.1, //摩擦
  restitution: 0.9
})
world.addContactMaterial(concretePlasticMaterial)

//default material
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: 0.1,
  restitution: 0.9
})
world.defaultContactMaterial = defaultContactMaterial

//sphere
// const sphereShape = new CANNON.Sphere(0.5)
// const sphereBody = new CANNON.Body({
// mass: 1, //密度
// shape: sphereShape,
// position: new CANNON.Vec3(0, 3, 0)
// // material: plasticMaterial
// })
// /**
//  * force
//  */
// sphereBody.applyLocalForce(new CANNON.Vec3(100, 0, 0), new CANNON.Vec3(0, 0, 0))

// world.addBody(sphereBody)

//floor
const floorBody = new CANNON.Body({
  mass: 0, //物体是静止的话，设为0
  shape: new CANNON.Plane()
  // material: concreteMaterial
})
//旋转
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2)
world.addBody(floorBody)

/**
 * create sphere fn
 */
const objects = []

const sphereGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const createSphere = (radius, pos) => {
  //threejs sphere
  const mesh = new THREE.Mesh(
    sphereGeometry,
    new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 })
  )
  mesh.scale.set(radius, radius, radius)
  mesh.position.copy(pos)
  mesh.castShadow = true
  scene.add(mesh)

  //physics sphere
  const body = new CANNON.Body({
    mass: 1, //密度
    shape: new CANNON.Sphere(radius)
  })
  body.position.copy(pos)
  world.addBody(body)
  objects.push({
    mesh,
    body
  })
}

const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 })
const createBox = (w, h, d, pos) => {
  //threejs box
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
  mesh.scale.set(w, h, d)
  mesh.position.copy(pos)
  mesh.castShadow = true
  scene.add(mesh)

  //physics box
  const body = new CANNON.Body({
    mass: 1, //密度
    shape: new CANNON.Box(new CANNON.Vec3(w / 2, h / 2, d / 2))
  })
  body.position.copy(pos)
  //事件 collide sleep wakeup
  //监听碰撞事件
  body.addEventListener('collide', (collide) => {
    console.log('collide', collide)
    //碰撞强度
    // collide.contact.getImpactVelocityAlongNormal()
  })
  world.addBody(body)
  objects.push({
    mesh,
    body
  })
}

const objectsGui = {
  createSphere: () => {
    createSphere(Math.random(), {
      x: (Math.random() - 0.5) * 10,
      y: 3,
      z: (Math.random() - 0.5) * 10
    })
  },
  createBox: () => {
    createBox(Math.random(), Math.random(), Math.random(), {
      x: (Math.random() - 0.5) * 5,
      y: 3,
      z: (Math.random() - 0.5) * 5
    })
  },
  reset: () => {
    objects.forEach(({ mesh, body }) => {
      body.removeEventListener('collide')
      world.removeBody(body)
      scene.remove(mesh)
    })
  }
}
gui.add(objectsGui, 'createSphere')
gui.add(objectsGui, 'createBox')
gui.add(objectsGui, 'reset')

scene.add(new THREE.AxesHelper(100), plane)

/**
 * animates
 */
let clock = new THREE.Clock()
let lastElapsedTime = 0
function animate() {
  const elapsedTime = clock.getElapsedTime()
  const delta = elapsedTime - lastElapsedTime
  lastElapsedTime = elapsedTime
  /**
   * update physics world
   */
  //update objects
  objects.forEach(({ mesh, body }) => {
    mesh.position.copy(body.position)
    mesh.quaternion.copy(body.quaternion)
  })
  //force
  // sphereBody.applyForce(new CANNON.Vec3(-0.2, 0, 0), sphereBody.position)
  //step(固定时间步长, 距离上一帧的时间, 最大步长 )
  world.step(1 / 60, delta, 3)
  //将物理世界的坐标赋值给sphere
  // sphere.position.copy(sphereBody.position)

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
