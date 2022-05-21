/**
 * @description geometry bufferGeometry dat.gui
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import gsap from 'gsap' //动画

import * as dat from 'dat.gui' //调试工具

import runTextures from './textures'
import runFonts from './Text'
console.log('THREE', THREE)

/**
 * dat.gui
 */
const gui = new dat.GUI({ closed: true, width: 400 })
//处理颜色
const parameters = {
  color: 0x666600,
  spin: () => {
    console.log('spin')
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 })
  }
}
gui.addColor(parameters, 'color').onChange(() => {
  //threejs中color是一个类, 通过set()来修改
  console.log(material.color)
  material.color.set(parameters.color)
})

gui.add(parameters, 'spin')

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//scene
const scene = new THREE.Scene()
const canvas = document.getElementById('canvas')

/**
 * geometry
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)

//bufferGeometry
//1 创建BufferGeometry 2 创建顶点数组, 存入顶点数据 3 设置position属性
// const geometry = new THREE.BufferGeometry()
// const vertices = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0])
// geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

// const count = 50
// const geometry = new THREE.BufferGeometry()
// const vertices = new Float32Array(count * 3 * 3) //每个三角有3个点，每个点有三个坐标xyz
// for (let index = 0; index < count * 3 * 3; index++) {
//   vertices[index] = (Math.random() - 0.5) * 4
// }
// geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

const material = new THREE.MeshBasicMaterial({ color: parameters.color, wireframe: false })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(4, 0, 0)
// scene.add(mesh)

/**
 * gui
 */
gui.add(mesh.position, 'y', -3, 2, 0.01) //min max step
gui.add(mesh.position, 'x').min(-3).max(2).step(0.01).name('x of mesh')
gui.add(mesh, 'visible').name('visible')
gui.add(material, 'wireframe').name('wireframe')

//camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(5, 5, 5)
camera.lookAt(mesh.position)
scene.add(camera)

//controls
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
  canvas
})

scene.add(new THREE.AxesHelper(100))

renderer.setSize(sizes.width, sizes.height)

// renderer.setClearColor(new THREE.Color(0xeeeeee))

let clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  // mesh.position.x = Math.sin(elapsedTime)

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()

// runTextures({ THREE, scene })
runFonts({ THREE, scene })
