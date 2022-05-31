/**
 * @description 简单场景demo(模型、2d label、点击模型镜头聚焦)
 */

import * as THREE from 'three'
import { Mesh } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { gui, renderer, camera, scene, controls, directionLight } from './init'

const TWEEN = require('@tweenjs/tween.js')
console.log('TWEEN', TWEEN)

/**
 * texture
 */
const textureLoader = new THREE.TextureLoader()

/**
 * load models
 */
const models = []
const gltfLoader = new GLTFLoader()

// gltfLoader.load('/assets/models/duck/Duck.gltf', (gltf) => {
//   gltf.scene.scale.set(0.2, 0.2, 0.2)
//   gltf.scene.position.set(-1, 0, 0)
//   console.log('gltf.scene 1', gltf.scene)
//   models.push(gltf.scene)
//   scene.add(gltf.scene)
// })
// gltfLoader.load('/assets/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
//   console.log(gltf)
//   //TODO: environment map
//   // gltf.scene.children[0].material
//   console.log('gltf.scene 2', gltf.scene)

//   models.push(gltf.scene)
//   scene.add(gltf.scene)
// })
// gltfLoader.load('/assets/models/Fox/glTF/Fox.gltf', (gltf) => {
//   gltf.scene.scale.set(0.01, 0.01, 0.01)
//   gltf.scene.position.set(1, 0, 0)
//   console.log('gltf.scene 3', gltf.scene)

//   models.push(gltf.scene)
//   scene.add(gltf.scene)
// })

/**
 * objects
 */
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff
})
const geometry = new THREE.PlaneBufferGeometry(10, 10, 128, 128)

const plane = new THREE.Mesh(geometry, material)
plane.scale.y = 2 / 3
plane.rotation.x = -Math.PI / 2

const obj1 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 32, 32),
  new THREE.MeshLambertMaterial({
    color: 0xff9900,
    transparent: true
  })
)
obj1.position.set(-2, 0.5, 0)

const obj2 = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.5, 1, 0.5, 32, 32),
  new THREE.MeshLambertMaterial({
    color: 0xff99ff,
    transparent: true
  })
)

const obj3 = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 1, 32),
  new THREE.MeshLambertMaterial({
    color: 0xcccc00,
    transparent: true
  })
)
obj3.position.set(2, 0.5, 0)

models.push(obj1, obj2, obj3)
models.forEach((model) => {
  model.userData.clickable = true
})

scene.add(new THREE.AxesHelper(100), plane, ...models)

/**
 * labels
 */
const label = document.createElement('div')
label.innerText = 'TITLE'
label.style.zIndex = 999
label.style.color = 'white'
label.style.position = 'absolute'
label.style.opacity = 0
label.style.width = '100px'
label.style.height = '100px'
// label.style.top = 0
// label.style.left = 0
document.body.appendChild(label)

const transPosition = (position) => {
  let world_vector = new THREE.Vector3(position.x, position.y, position.z)
  let vector = world_vector.project(camera)
  let halfWidth = window.innerWidth / 2,
    halfHeight = window.innerHeight / 2
  return {
    x: Math.round(vector.x * halfWidth + halfWidth),
    y: Math.round(-vector.y * halfHeight + halfHeight)
  }
}

/**
 * mouse
 */
const position = new THREE.Vector2(null, null)
const pickPosition = new THREE.Vector2(null, null)

/**
 * camera
 */
const cameraOriPos = {
  x: 0.5,
  y: 4,
  z: 10
}

/**
 * raycaster
 */

const raycaster = new THREE.Raycaster()
let intersects = []
let currentSelected = null

const setRaycaster = () => {
  models.map((item) => (item.material.opacity = 1))
  if (position.x === null || position.y === null) return
  raycaster.setFromCamera(position, camera)
  // console.log('model', models, [...models.map((item) => item.children)].flat())
  intersects = raycaster.intersectObjects(models)
  if (intersects.length) {
    currentSelected = intersects.find((item) => item.object.userData.clickable).object
    if (currentSelected) currentSelected.material.opacity = 0.7
    // console.log('currentSelected', currentSelected)
    return
  }
}

window.addEventListener('mousemove', (event) => {
  position.x = (event.clientX / window.innerWidth) * 2 - 1
  position.y = -(event.clientY / window.innerHeight) * 2 + 1
})

window.addEventListener('click', (event) => {
  pickPosition.x = (event.clientX / window.innerWidth) * 2 - 1
  pickPosition.y = -(event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(pickPosition, camera)
  const intersectsClicked = raycaster.intersectObjects(models)
  const cloneCamera = camera.clone() //克隆相机
  let clickedObj = null
  if (intersectsClicked.length) {
    clickedObj = intersectsClicked.find((item) => item.object.userData.clickable)
    if (clickedObj) {
      cloneCamera.position.set(
        clickedObj.object.position.x,
        clickedObj.object.position.y + 2,
        clickedObj.object.position.z + 2
      )
      const pos = transPosition(clickedObj.object.position)
      label.style.opacity = 1
      label.style.left = `${pos.x}px`
      label.style.top = `${pos.y}px`
      console.log('pos', pos, label)
    }
  }
  if (!clickedObj) {
    cloneCamera.position.set(cameraOriPos.x, cameraOriPos.y, cameraOriPos.z)
    label.style.opacity = 0
  }
  new TWEEN.Tween(camera.position)
    .to({ x: cloneCamera.position.x, y: cloneCamera.position.y, z: cloneCamera.position.z }, 2000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
  new TWEEN.Tween(camera.rotation)
    .to({ x: cloneCamera.rotation.x, y: cloneCamera.rotation.y, z: cloneCamera.rotation.z }, 2000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
})

/**
 * animates
 */
let clock = new THREE.Clock()
let prev = 0
function animate() {
  const elapsedTime = clock.getElapsedTime()
  const delta = elapsedTime - prev
  prev = elapsedTime
  TWEEN.update()
  // arrowHelper.setDirection(position.x, position.y, camera.position.z)
  // intersects = raycaster.intersectObjects(models)
  setRaycaster()

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
