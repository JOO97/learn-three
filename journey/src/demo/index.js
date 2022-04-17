import * as THREE from '../lib/three.module.js'
console.log('THREE', THREE)

//scene
const scene = new THREE.Scene()

//geometry
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xffee66 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 5, 5)
camera.lookAt(scene.position)

scene.add(camera)
//render
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas')
})

scene.add(new THREE.AxesHelper(100))

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(new THREE.Color(0xeeeeee))

/**
 * animations
 */

let clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  mesh.position.x = Math.sin(elapsedTime)

  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
