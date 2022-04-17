import * as THREE from './libs/build/three.module.js'
import { OrbitControls } from './libs/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './libs/jsm/loaders/GLTFLoader.js'
import { ColladaLoader } from './libs/jsm/loaders/ColladaLoader.js'

let camera, scene, renderer, model

function init() {
  initCamera()
  initScene()
  initRenderer()

  initLight()

  addModel()

  initControl()

  animate()
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 10, 20)
  camera.lookAt(new THREE.Vector3())
}

function initScene() {
  scene = new THREE.Scene()
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true }) //抗锯齿
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(new THREE.Color(0xffffff))
  renderer.shadowMap.enable = true
  document.querySelector('body').appendChild(renderer.domElement)
}

function initLight() {
  //环境光
  scene.add(new THREE.AmbientLight(0xeeeeee))
  //平行光
  const light = new THREE.SpotLight(0xaaaaaa)
  light.position.set(0, 100, 100)
  // light.lookAt(new THREE.Vector3())
  light.castShadow = true //开启阴影投射
  light.angle = Math.PI / 10
  light.shadow.penumbra = 0.05
  light.shadow.mapSize.width = 1024
  light.shadow.mapSize.height = 1024
  scene.add(light)
}

function initControl() {
  new OrbitControls(camera, renderer.domElement)
}

function addModel() {
  addGrass()
  addPerson()
  addSheep()
  const geo = new THREE.BoxGeometry(2, 2, 2)
  const material = new THREE.MeshLambertMaterial({ color: 'pink' })
  const mesh = new THREE.Mesh(geo, material)
  mesh.position.set(2, 0, 0)
  mesh.castShadow = true
  scene.add(mesh)
}

//添加羊模型
function addSheep() {
  // const loader = new ColladaLoader().setPath('./assets/sheep/')
  // loader.load('sheep01.blend', (gltf) => {
  //   console.log('gltf', gltf)
  //   const mesh = gltf.scene.children[0]
  //   mesh.position.set(-5, 0, 0)
  //   console.log(mesh)
  //   mesh.castShadow = true
  //   scene.add(mesh)
  // })
}

//添加人物模型
function addPerson() {
  const loader = new GLTFLoader().setPath('./assets/jinx/')
  loader.load('scene.gltf', (gltf) => {
    console.log('gltf', gltf)
    const mesh = gltf.scene.children[0]
    console.log(mesh)
    mesh.rotation.z = 90
    mesh.castShadow = true
    scene.add(mesh)
  })
}

//添加草地
function addGrass() {
  const texture = new THREE.TextureLoader().load(
    './assets/1edea944dc7fc93c20629c29f13e4a8f_800_600.jpg'
  )
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(600, 600)
  texture.anisotropy = 10
  const material = new THREE.MeshLambertMaterial({ map: texture })
  const plane = new THREE.PlaneGeometry(10000, 10000)
  const mesh = new THREE.Mesh(plane, material)
  mesh.rotation.x = -Math.PI * 0.5 //plane默认是竖直加载
  mesh.receiveShadow = true //草地接收阴影
  scene.add(mesh)
}

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

export { init }
