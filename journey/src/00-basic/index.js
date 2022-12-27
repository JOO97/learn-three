import * as THREE from '../../lib/three.module.js'
console.log('THREE', THREE)

//scene
const scene = new THREE.Scene()

//geometry
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xffee66 })
const mesh = new THREE.Mesh(geometry, material)
// mesh.position.set(new THREE.Vector3(0, 0, 0))
scene.add(mesh)

//camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 5, 5)
camera.lookAt(scene.position) //NOTE 一定要加

scene.add(camera)
//render
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas')
})

scene.add(new THREE.AxesHelper(100))

// document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(new THREE.Color(0xeeeeee))

/**
 * animations
 */

//1
// let time = Date.now()
// function animate() {
//   let current = Date.now()
//   const deltaTime = current - time
//   time = current
//   mesh.rotation.y += 0.001 * deltaTime
//   renderer.render(scene, camera)
//   window.requestAnimationFrame(animate)
// }

//2
let clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime() //获取自时钟启动后的秒数
  // const deltaTime = clock.getDelta() //获取自 .oldTime 设置后到当前的秒数
  // mesh.rotation.y += deltaTime
  // console.log(clock, deltaTime)
  // mesh.rotation.y = elapsedTime

  mesh.position.x = Math.sin(elapsedTime)
  // mesh.rotation.y = Math.PI * elapsedTime
  // camera.lookAt(mesh.position)

  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
