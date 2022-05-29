/**
 * @description Shades
 */
/**
 * 1. 着色器 定位geometry的顶点坐标 对geometry的每个像素点进行着色
 * - GLSL
 * - data attributes uniform
 * - 顶点着色器
 * - 片段着色器
 */

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { gui, renderer, camera, scene, controls, directionLight } from './init'

//shader
import vertexShader from './shaders/test/vertex.glsl'
import fragmentShader from './shaders/test/fragment.glsl'

const cameraConfig = {
  x: 0,
  y: 0,
  z: 2
}
gui
  .add(cameraConfig, 'x')
  .min(-100)
  .max(100)
  .step(1)
  .name('camera x')
  .onChange(() => {
    camera.position.set(cameraConfig.x, cameraConfig.y, cameraConfig.z)
  })
gui
  .add(cameraConfig, 'y')
  .min(-100)
  .max(100)
  .step(1)
  .name('camera y')
  .onChange(() => {
    camera.position.set(cameraConfig.x, cameraConfig.y, cameraConfig.z)
  })
gui
  .add(cameraConfig, 'z')
  .min(-100)
  .max(100)
  .step(1)
  .name('camera z')
  .onChange(() => {
    camera.position.set(cameraConfig.x, cameraConfig.y, cameraConfig.z)
  })
camera.position.set(cameraConfig.x, cameraConfig.y, cameraConfig.z)
camera.fov = 45

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
  //NOTE:将变量传递给着色器
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uColor: {
      value: new THREE.Color('orange')
    },
    uTexture: { value: flagTexture }
  },
  transparent: true
  // wireframe: true
})
/**
 * raw shader
 */
// const material = new THREE.RawShaderMaterial({
//   vertexShader,
//   fragmentShader,
//   side: THREE.DoubleSide,
//   //NOTE:将变量传递给着色器
//   uniforms: {
//     uFrequency: { value: new THREE.Vector2(10, 5) },
//     uTime: { value: 0 },
//     uColor: {
//       value: new THREE.Color('orange')
//     },
//     uTexture: { value: flagTexture }
//   },
//   transparent: true
//   // wireframe: true
// })

gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('uFrequency x')
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('uFrequency y')

const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32) //NOTE: 要使用bufferGeometry

//添加自定义属性aRandom
const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for (let i = 0; i < count; i++) {
  randoms[i] = Math.random()
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

const plane = new THREE.Mesh(geometry, material)
plane.scale.y = 2 / 3
// plane.rotation.x = -Math.PI / 2
// plane.receiveShadow = true

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

  //NOTE: update material uniforms uTime
  material.uniforms.uTime.value = elapsedTime

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
