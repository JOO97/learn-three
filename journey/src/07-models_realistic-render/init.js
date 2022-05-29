import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import gsap from 'gsap' //动画

import * as dat from 'dat.gui' //调试工具

/**
 * dat.gui
 */
const gui = new dat.GUI({ closed: false, width: 400 })

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

/**
 * scene
 */
const scene = new THREE.Scene()
const canvas = document.getElementById('canvas')

/**
 * ambientLight
 */
const light = {
  ambient: 0xffffff,
  direction: 0xffffff
}
const ambientLight = new THREE.AmbientLight(light.ambient, 1)
gui.add(ambientLight, 'intensity').min(0).max(10).step(0.001)
gui.addColor(light, 'ambient').onChange(() => {
  ambientLight.color.set(light.ambient)
})

scene.add(ambientLight)

/**
 * direction light
 */

const directionLight = new THREE.DirectionalLight(light.direction, 3)
directionLight.position.set(-4, 21, 15)
gui.add(directionLight, 'intensity').min(0).max(10).step(0.001).name('direction intensity')
gui.addColor(light, 'direction').onChange(() => {
  directionLight.color.set(light.direction)
})
directionLight.castShadow = true
directionLight.shadow.mapSize.width = 1024
directionLight.shadow.mapSize.height = 1024

gui.add(directionLight.position, 'x').min(-30).max(30).step(0.001)
gui.add(directionLight.position, 'y').min(-30).max(30).step(0.001)
gui.add(directionLight.position, 'z').min(-30).max(30).step(0.001)

scene.add(directionLight, new THREE.DirectionalLightHelper(directionLight, 5))

/**
 * camera
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(5, 2, 4)
scene.add(camera)

/**
 * controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
})

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true //NOTE: 消除锯齿
})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2)
renderer.physicallyCorrectLights = true //是否使用物理上正确的光照模式

export { gui, renderer, camera, scene, controls, directionLight }
