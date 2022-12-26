import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
console.log('THREE', THREE, OrbitControls)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//scene
const scene = new THREE.Scene()
const canvas = document.getElementById('canvas')
//geometry
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x395f9b })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)

//正交相机
// const distance = 2
// const aspect = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(
//   distance * aspect * -1, //left
//   distance * aspect, //right
//   distance, //top
//   -distance, //bottom
//   0.1,
//   100
// )

camera.position.set(5, 5, 5)
camera.lookAt(mesh.position)
scene.add(camera)

//controls
const controls = new OrbitControls(camera, canvas)
//将其设置为true以启用阻尼（惯性），这将给控制器带来重量感。默认值为false。
//请注意，如果该值被启用，你将必须在你的动画循环里调用.update()。
controls.enableDamping = true

//窗口大小变化时
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //1更新camera的比例
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  //2更新render的size
  renderer.setSize(sizes.width, sizes.height)
  //解决设备像素比不同的问题, 像素比过大影响性能
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//全屏
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

//render
const renderer = new THREE.WebGLRenderer({
  canvas
})

scene.add(new THREE.AxesHelper(100))

renderer.setSize(sizes.width, sizes.height)

renderer.setClearColor(new THREE.Color(0xeeeeee))

/**
 * animations
 */

let clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  // mesh.position.x = Math.sin(elapsedTime)

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
