import {
  AxesHelper,
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshFaceMaterial,
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
  PlaneHelper,
  FlatShading
} from 'three'

import * as THREE from 'three'

window.THREE = THREE

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import ThreeBSP from './lib/ThreeBSP'

import * as dat from 'dat.gui'

const objects = {
  floor: {
    name: 'floor',
    size: {
      w: 2000,
      h: 2000,
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

const { w } = objects.floor.size

const params = {
  planeConstant: 0
}

renderer.localClippingEnabled = true //允许剪裁
// renderer.clippingPlanes = clipPlanes

// let clipPlanes = [
//   // new Plane(new Vector3(1, 0, 0), 0),
//   // new Plane(new Vector3(0, -1, 0), 0),
//   // new Plane(new Vector3(0, 0, -1), 0)
//   new Plane(new Vector3(1, 0, 0), -(w * 0.45) / 2 - 20), //旋转角度, 距离原始位置的距离
//   new Plane(new Vector3(1, 0, 0), (w * 0.45) / 2 + 20),
//   new Plane(new Vector3(pos.x, pos.y, pos.z), (w * 0.45 - w * 0.45 * 0.5) / 2),
//   new Plane(new Vector3(0, 0, 0), -(w * 0.45 - w * 0.45 * 0.5) / 2)
// ]
// let helpers = new Group()
// helpers.add(new PlaneHelper(clipPlanes[0], 1000, 0xffffff))
// helpers.add(new PlaneHelper(clipPlanes[1], 1000, 0x000000))
// helpers.add(new PlaneHelper(clipPlanes[2], 1000, 0xff0000))
// helpers.add(new PlaneHelper(clipPlanes[3], 1000, 0x00ff00))

/* walls */
const createWalls = () => {
  const size = {
    w: w,
    h: 300,
    d: 10
  }
  const colors = ['#8da5b3', '#8da5b3', '#c1c1c1', '#c1c1c1', '#8da5b3', '#e8f9f9'] //left right top bottom front back
  const geometry = new BoxGeometry(size.w, size.h, size.d)
  const materials = colors.map((color) => {
    return new MeshBasicMaterial({
      color: new Color(color)
      // clipIntersection: true,
      // clippingPlanes: clipPlanes
    })
  })
  const walls = []
  Array(4)
    .fill('')
    .forEach((_, index) => {
      const idx = (index + 1) % 2
      let door = null
      let mesh = new Mesh(geometry, materials)
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
        door = createDoor(
          w * 0.45 * 0.5,
          330 * 0.5,
          10,
          mesh.position.x,
          mesh.position.y + 0.1,
          mesh.position.z
        )
      }
      if (door) {
        // const material2 = new THREE.MeshPhongMaterial({
        //   color: 0x9cb2d1,
        //   specular: 0x9cb2d1,
        //   shininess: 30,
        //   transparent: true,
        //   opacity: 1
        // })
        const resultBSP = new ThreeBSP(mesh).subtract(new ThreeBSP(door))
        mesh = resultBSP.toMesh(Array(16).fill(materials[0]))

        mesh.geometry.computeVertexNormals() // 更新面和顶点的数据
        // mesh.material.needsUpdate = true
        mesh.geometry.buffersNeedUpdate = true
        mesh.geometry.uvsNeedUpdate = true
      }
      walls.push(mesh)
    })

  return walls
}

// 创建门
const createDoor = (w, h, d, x, y, z) => {
  const door = new Mesh(
    new BoxGeometry(w, h, d, 1, 1, 1),
    new MeshBasicMaterial({
      color: new Color('#000')
    })
  )
  door.position.set(x, y, z)
  door.rotateY(Math.PI / 2)

  return door
}

//gui
const gui = new dat.GUI({ width: 300 })

gui.addColor(lights, 'AmbientLight').onChange((color) => {
  light.color.set(new Color(color))
})

// gui
//   .add(params, 'planeConstant', -1000, 1000)
//   .step(1)
//   .name('plane constant')
//   .onChange(function (value) {
//     for (let j = 0; j < clipPlanes.length; j++) {
//       clipPlanes[j].constant = value
//     }
//   })

// gui.add(pos, 'x', -1, 1, 0.1).onChange((x) => {
//   helpers.children[1].position.setX(x)
// })
// gui.add(pos, 'y', -1, 1).onChange((y) => {
//   helpers.children[1].position.setY(y)
// })
// gui.add(pos, 'z', -1, 1).onChange((z) => {
//   helpers.children[1].position.setZ(z)
// })
// const cameraPos = camera.position
// gui.add(cameraPos, 'x', 0.1, 1000, 1)
// gui.add(cameraPos, 'y', 0.1, 1000, 1)
// gui.add(cameraPos, 'z', 0.1, 1000, 1)

scene.add(new AxesHelper(5000), camera, light)

//animate
const animate = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()
createObjects()
