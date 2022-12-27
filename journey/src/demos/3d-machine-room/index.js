import {
  AxesHelper,
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Group,
  AmbientLight,
  TextureLoader,
  RepeatWrapping,
  DoubleSide,
  PlaneGeometry,
  Vector3,
  Shape,
  Plane,
  PlaneHelper
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

const objects = {
  floor: {
    name: 'floor',
    size: {
      w: 2000,
      h: 1600,
      d: 10
    }
  }
}
const lights = {
  AmbientLight: '#ffffff'
}

const canvas = document.getElementById('canvas')

let group = null //object group

const textureLoader = new TextureLoader()

//scene camera render
const scene = new Scene()

const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000)
camera.position.set(1400, 1000, -1800)
camera.lookAt(new Vector3(0, 0, 0))

const renderer = new WebGLRenderer({
  canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(new Color(0x225f93))

//light
const light = new AmbientLight(new Color(lights['AmbientLight']))

//controls
const controls = new OrbitControls(camera, canvas)

//objects
const createObjects = () => {
  group = new Group()
  const floor = createFloor()
  const walls = createWalls()

  group.add(floor, ...walls)
  scene.add(group)
}

/* floor */
const createFloor = () => {
  const geometry = new BoxGeometry(
    objects.floor.size.w,
    objects.floor.size.h,
    objects.floor.size.d,
    1,
    1,
    1
  )
  const texture = textureLoader.load('/assets/textures/floor.jpg')
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.repeat.set(7, 7)

  const material = new MeshBasicMaterial({
    color: new Color('#b9babf'),
    map: texture,
    side: DoubleSide
  })
  // material.transparent = true
  // material.opacity = 0.8
  const materials = Array(6).fill(
    new MeshBasicMaterial({
      color: new Color('#6ea1b5'),
      side: DoubleSide
    })
  )
  materials[5] = material
  const mesh = new Mesh(geometry, materials)
  mesh.position.set(0, 0, 0)
  mesh.rotation.set(Math.PI / 2, 0, 0)
  return mesh
}

let clipPlanes = [
  new Plane(new Vector3(450, 160, 0), 0),
  new Plane(new Vector3(0, -1, 0), 0),
  new Plane(new Vector3(0, 0, -1), 0)
]
let helpers = new Group()
helpers.add(new PlaneHelper(clipPlanes[0], 2000, 0xff0000))
// helpers.add(new PlaneHelper(clipPlanes[1], 2000, 0xff0000))
// helpers.add(new PlaneHelper(clipPlanes[2], 2000, 0xff0000))

/* walls */
const createWalls = () => {
  const { w } = objects.floor.size

  const size = {
    w: w * 0.45,
    h: 330,
    d: 10
  }
  const colors = ['#8da5b3', '#8da5b3', '#c1c1c1', '#c1c1c1', '#8da5b3', '#e8f9f9'] //left right top bottom front back
  const geometry = new BoxGeometry(size.w, size.h, size.d)
  const materials = colors.map((color) => {
    return new MeshBasicMaterial({
      color: new Color(color),
      clipIntersection: true,
      clippingPlanes: [clipPlanes[0]]
    })
  })
  const walls = []
  Array(4)
    .fill('')
    .forEach((_, index) => {
      const idx = (index + 1) % 2
      const mesh = new Mesh(geometry, materials)
      mesh.position.set(
        index === 1 ? size.w / 2 : index === 3 ? -size.w / 2 : 0,
        size.h / 2,
        index === 0 ? size.w / 2 : index === 2 ? -size.w / 2 : 0
      )
      if (!idx) {
        mesh.rotateY(Math.PI / 2)
      }
      if (index === 2 || index === 3) {
        mesh.rotateX(Math.PI)
      }
      if (index === 1) {
        const windowObj = new Mesh(
          new BoxGeometry(w * 0.45 * 0.5, 330 * 0.5, 10, 1, 1, 1),
          new MeshBasicMaterial({
            color: new Color('#000'),
            transparent: true,
            opacity: 0.5
          })
        )
        windowObj.position.set(mesh.position.x, mesh.position.y + 0.1, mesh.position.z)
        windowObj.rotateY(Math.PI / 2)
        console.log('mesh', mesh.geometry)
        console.log('windowObj', windowObj.geometry)
        const shape = new Shape()
        shape.moveTo(450, 165)
        console.log('shape', shape.holes)
        scene.add(windowObj)
      }
      walls.push(mesh)
    })

  return walls
}

//gui
const gui = new dat.GUI({ width: 300 })

gui.addColor(lights, 'AmbientLight').onChange((color) => {
  light.color.set(new Color(color))
})
// const cameraPos = camera.position
// gui.add(cameraPos, 'x', 0.1, 1000, 1)
// gui.add(cameraPos, 'y', 0.1, 1000, 1)
// gui.add(cameraPos, 'z', 0.1, 1000, 1)

scene.add(new AxesHelper(5000), camera, light, helpers)

//animate
const animate = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()
createObjects()
