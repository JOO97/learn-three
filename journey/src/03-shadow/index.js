/**
 * @description geometry bufferGeometry dat.gui
 */

import * as THREE from 'three'
import { gui, renderer, camera, scene, controls } from './init'

/**
 * @description shadow
 */
/**
 * 1. 根据shadow map来添加shadow
 * 2. example https://threejs.org/examples/?q=shadowmap#webgl_shadowmap_viewer
 * 3. point spot direction三种支持shadow
 * 4. 设置阴影： 渲染器、物体、光
 * 5. 优化shadow
 *    1. shadow.mapSize, 默认是512x512
 *    2. shadow.camera: near far top left right bottom
 * 6. shadowMap类型
 *    1. PCShadowMap
 *    2. PCFSoftShadowMap
 *    3. BasicShadowMap
 *    4. VSMShadowMap
 * 7. baking shadow: 多个阴影整合到texture中
 */

/**
 * directionLight
 */
const light = {
  direction: 0xfffff
}
const directionLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionLight.position.set(2, 2, -1)
gui.addColor(light, 'direction').onChange(() => {
  directionLight.color.set(light.direction)
})
//优化shadow 1
directionLight.shadow.mapSize.width = 1024
directionLight.shadow.mapSize.height = 1024

//优化shadow 2
directionLight.shadow.camera.near = 1
directionLight.shadow.camera.far = 6
directionLight.shadow.camera.top = 2
directionLight.shadow.camera.bottom = -2
directionLight.shadow.camera.right = 2
directionLight.shadow.camera.left = -2

directionLight.shadow.radius = 6 //阴影模糊

//render 开启shadowMap
renderer.shadowMap.enabled = true

//阴影类型
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

//NOTE: direction light 开启阴影
directionLight.castShadow = true

/**
 * SpotLight
 */
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.position.set(0, 3, -3)
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 40 //相机视野角度大小
spotLight.shadow.camera.far = 7
spotLight.shadow.camera.near = 1
gui.add(spotLight.position, 'x').min(-50).max(50).step(0.01).name('spotLight x')
gui.add(spotLight.position, 'y').min(-50).max(50).step(0.01).name('spotLight y')
gui.add(spotLight.position, 'z').min(-50).max(50).step(0.01).name('spotLight z')

/**
 * PointLight
 */
const pointLight = new THREE.PointLight(0xffffff, 0.2)
pointLight.castShadow = true
pointLight.position.set(-1, 1.5, 0)
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 1
pointLight.shadow.camera.far = 6
gui.add(pointLight.position, 'x').min(-50).max(50).step(0.01).name('pointLight x')
gui.add(pointLight.position, 'y').min(-50).max(50).step(0.01).name('pointLight y')
gui.add(pointLight.position, 'z').min(-50).max(50).step(0.01).name('pointLight z')

/**
 * cameraHelper
 */
const cameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
cameraHelper.visible = true

/**
 * mesh
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(3).step(0.001)
gui.add(material, 'roughness').min(0).max(3).step(0.001)
const plane = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), material)
//NOTE: 旋转角度要通过PI来设置
plane.rotation.x = -Math.PI * 0.5 //plane默认是竖直加载
plane.position.y = -0.3
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.position.set(0, 0.2, 0)

//开启阴影
sphere.castShadow = true
plane.receiveShadow = true

scene.add(
  sphere,
  plane,
  directionLight,
  spotLight,
  /* NOTE: */ spotLight.target,
  cameraHelper,
  pointLight
)

/**
 * AxesHelper
 */
scene.add(new THREE.AxesHelper(100))

/**
 * animate
 */
let clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
