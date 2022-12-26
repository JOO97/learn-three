import { AxesHelper, Color, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const canvas = document.getElementById('canvas')

//scene camera render
const scene = new Scene()
scene.add(new AxesHelper())

const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, 1)
scene.add(camera)

const renderer = new WebGLRenderer({
  canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(new Color(0x808080))

//controls
const controls = new OrbitControls(camera, canvas)

//geometry

//animate
const animate = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()
