/**
 * @description Model
 */
/**
 * 1. model
 *
 * 2. realistic render
 * 2.1 CubeTextureLoader加载环境贴图 设置scene.background 环境贴图设置encoding
 * 2.2 scene.environment 给场景中的元素添加envMap
 * 2.3 设置render outputEncoding、toneMapping antialias
 *
 */

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { gui, renderer, camera, scene, controls, directionLight } from './init'

const cameraConfig = {
  x: -10,
  y: 5,
  z: 9
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
camera.fov = 30

/**
 * texture
 */
const textureLoader = new THREE.TextureLoader()

/**
 * GLTF Loader
 */
const gltfLoader = new GLTFLoader()
gltfLoader.load('/assets/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  gltf.scene.position.set(0, -2, 0)
  gltf.scene.scale.set(10, 10, 10)
  gltf.scene.rotation.set(0, -Math.PI / 2, 0)
  scene.add(gltf.scene)
  updateAllMaterial()
})

/**
 * model animation
 */
let mixer = null
gltfLoader.load('/assets/models/Fox/glTF/FOX.gltf', (gltf) => {
  // gltf.scene.position.set(0, 0, 2)
  // gltf.scene.scale.set(0.01, 0.01, 0.01)
  // scene.add(gltf.scene)
  // mixer = new THREE.AnimationMixer(gltf.scene)
  // const action = mixer.clipAction(gltf.animations[1])
  // action.play()
})

/**
 * environment map
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
  '/assets/maps/Standard-Cube-Map/px.png',
  '/assets/maps/Standard-Cube-Map/nx.png',
  '/assets/maps/Standard-Cube-Map/py.png',
  '/assets/maps/Standard-Cube-Map/ny.png',
  '/assets/maps/Standard-Cube-Map/pz.png',
  '/assets/maps/Standard-Cube-Map/nz.png'
])

environmentMap.encoding = THREE.sRGBEncoding
// environmentMap.mapping = THREE.CubeRefractionMapping
scene.background = environmentMap
scene.environment = environmentMap //更新所有元素material的envMap

/**
 * 手动更新所有元素material的envMap
 */

const envConfig = {
  envMapIntensity: 2
}

const updateAllMaterial = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      //2
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = envConfig.envMapIntensity
      child.material.needsUpdate = true //NOTE:
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}
gui.add(envConfig, 'envMapIntensity').min(0).max(10).step(0.01).onChange(updateAllMaterial)

/**
 * Plane
 */
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0x403f3f })
)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true

directionLight.shadow.camera.far = 30
directionLight.shadow.mapSize.set(1024, 1024)
scene.add(new THREE.AxesHelper(100), new THREE.CameraHelper(directionLight.shadow.camera))

/**
 * render
 */

//outputEncoding
renderer.outputEncoding = THREE.sRGBEncoding //默认是THREE.LinearEncoding
//tone Mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
gui
  .add(renderer, 'toneMapping', {
    no: THREE.NoToneMapping,
    LinearToneMapping: THREE.LinearToneMapping,
    ReinhardToneMapping: THREE.ReinhardToneMapping,
    CineonToneMapping: THREE.CineonToneMapping,
    ACESFilmicToneMapping: THREE.ACESFilmicToneMapping
  })
  .onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterial()
  })
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.1)
/**
 * animates
 */
let clock = new THREE.Clock()
let prev = 0
function animate() {
  const elapsedTime = clock.getElapsedTime()
  const delta = elapsedTime - prev
  prev = elapsedTime

  //NOTE:
  if (mixer !== null) mixer.update(delta)
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
