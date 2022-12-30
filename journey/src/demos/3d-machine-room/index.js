import {
  AxesHelper,
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  BoxBufferGeometry,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshFaceMaterial,
  Mesh,
  Group,
  AmbientLight,
  DirectionalLight,
  TextureLoader,
  RepeatWrapping,
  DoubleSide,
  PlaneGeometry,
  Vector3,
  Shape,
  Plane,
  PlaneHelper,
  FlatShading,
  Raycaster,
  Vector2
} from './lib/three'
import * as THREE from './lib/three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import ThreeBSP from './lib/three-csg'
import * as dat from 'dat.gui'
import Tween from '@tweenjs/tween.js/dist/tween.esm'

let gui, canvas, camera, renderer, scene, controls, textureLoader, raycaster

const pointer = new Vector2()

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
  ambient: '#ffffff',
  directional: '#ffffff'
}

let group = null //object group

const { w } = objects.floor.size

const params = {
  planeConstant: 0
}

// renderer.localClippingEnabled = true //允许剪裁
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

const init = () => {
  const style = document.createElement('style')
  style.innerHTML = `
  #tooltip {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
}

  `
  const tooltip = document.createElement('span')
  tooltip.id = 'tooltip'
  document.head.appendChild(style)
  document.body.appendChild(tooltip)

  canvas = document.getElementById('canvas')

  scene = new Scene()

  camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000)
  camera.position.set(1400, 1000, -1800)
  camera.lookAt(new Vector3(0, 0, 0))

  renderer = new WebGLRenderer({
    canvas,
    alpha: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(new Color(0x225f93))

  const ambientLight = new AmbientLight(new Color(lights['ambient']))
  const directionalLight = new THREE.DirectionalLight(new Color(lights['directional']))

  controls = new OrbitControls(camera, renderer.domElement)

  textureLoader = new TextureLoader()

  raycaster = new Raycaster()

  window.addEventListener('pointermove', (e) => {
    onPointermove(e)
  })

  window.addEventListener('click', (e) => {
    onMouseClick(e)
  })

  gui = new dat.GUI({ width: 300 })
  gui.addColor(lights, 'ambient').onChange((color) => {
    light.color.set(new Color(color))
  })

  scene.add(new AxesHelper(5000), camera, ambientLight, directionalLight)

  requestAnimationFrame(animate)
  createObjects()
}

const createObjects = () => {
  group = new Group()
  const floor = createFloor()
  const walls = createWalls()

  group.add(...walls)
  scene.add(floor, group)
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
  const floorTexture = textureLoader.load('/assets/textures/floor.jpg')
  floorTexture.wrapS = RepeatWrapping
  floorTexture.wrapT = RepeatWrapping
  floorTexture.repeat.set(7, 7)

  const material = new MeshBasicMaterial({
    color: new Color('#b9babf'),
    map: floorTexture,
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
  mesh.userData.name = 'floor'
  return mesh
}

/* walls */
const createWalls = () => {
  const size = {
    w: w,
    h: 300,
    d: 10
  }

  const windowTexture = textureLoader.load('./assets/textures/window.png')
  const doorLeftTexture = textureLoader.load('./assets/textures/door_left.png')
  const doorRightTexture = textureLoader.load('./assets/textures/door_right.png')

  const colors = ['#afc0ca', '#afc0ca', '#d6e4ec', '#d6e4ec', '#afc0ca', '#afc0ca'] //left right top bottom front back
  const geometry = new BoxGeometry(size.w, size.h, size.d)
  const materials = colors.map((color) => {
    return new MeshPhongMaterial({
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
      const children = []
      let mesh = new Mesh(geometry, materials)
      mesh.position.set(
        index === 1 ? size.w / 2 : index === 3 ? -size.w / 2 : 0,
        size.h / 2,
        index === 0 ? size.w / 2 : index === 2 ? -size.w / 2 : 0
      )
      if (!idx) mesh.rotateY(Math.PI / 2)
      if (index === 2 || index === 3) mesh.rotateX(Math.PI)
      if (index === 0) {
        const { x, y, z } = mesh.position
        children.push(
          // {
          //   w: 300,
          //   h: 120,
          //   d: 10,
          //   x: x - 400,
          //   y: y + 20,
          //   z,
          //   type: 'window',
          //   texture: windowTexture
          // },
          {
            w: 300,
            h: 120,
            d: 10,
            x: x + 600,
            y,
            z,
            name: 'window#1',
            texture: windowTexture
          },
          {
            w: 120,
            h: 230,
            d: 10,
            x: x + 1,
            y: y - 40,
            z,
            name: 'door-left',
            texture: doorLeftTexture,
            translate: {
              x: 60
            },
            // rotation http://www.javashuo.com/article/p-glddmkxw-nx.html
            rotationY: -Math.PI / 2
          },
          {
            w: 120,
            h: 230,
            d: 10,
            x: x + 121,
            y: y - 40,
            z,
            name: 'door-right',
            texture: doorRightTexture,
            translate: {
              x: -60
            },
            rotationY: Math.PI / 2
          }
        )
      }
      if (children.length) {
        const meshB = []
        children.forEach((c) => {
          meshB.push(createBox(c.w, c.h, c.d, c.x, c.y, c.z, materials))
          const cGeometry = new BoxGeometry(c.w, c.h, c.d, c.x)
          const cMaterial = new MeshBasicMaterial({
            map: c.texture,
            color: 0xffffff,
            opacity: 1.0,
            transparent: true,
            size: DoubleSide
          })
          c.translate && cGeometry.translate(c.translate.x, 0, 0)

          const cMesh = new Mesh(cGeometry, cMaterial)

          cMesh.position.set(!c.translate ? c.x : c.x - c.translate.x, c.y, c.z)
          cMesh.userData = {
            name: c.name,
            selectable: false,
            clickable: true,
            state: 0,
            rotationY: c['rotationY']
          }
          scene.add(cMesh)
        })
        const result = digHoles(mesh, meshB, materials[0])
        walls.push(result)
      } else walls.push(mesh)
    })

  return walls.map((w, index) => Object.assign(w, { userData: { name: `wall${index + 1}` } }))
}

const createBox = (w, h, d, x, y, z, material) => {
  const door = new Mesh(new BoxGeometry(w, h, d, 1, 1, 1), material)
  door.position.set(x, y, z)
  // door.rotateY(Math.PI / 2)
  return door
}

/* dig hole */
const digHoles = (meshA, meshB, material, opt = 'subtract') => {
  meshB = meshB instanceof Array ? meshB : [meshB]
  meshA.updateMatrix()
  let bspA = ThreeBSP.fromMesh(meshA)
  meshB.forEach((item) => {
    item.updateMatrix()
    const bspB = ThreeBSP.fromMesh(item)
    bspA = bspA.subtract(bspB)
  })
  // mesh.updateMatrixWorld()
  // door.updateMatrixWorld()
  const result = ThreeBSP.toMesh(bspA, meshA.matrix, material)
  result.material.flatshading = THREE.FlatShading
  result.geometry.computeFaceNormals()
  result.geometry.computeVertexNormals()

  return result
}

const onPointermove = (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1

  const intersects = raycaster.intersectObjects(scene.children)
  intersects.forEach((i) => {
    if (!i['object']['userData']['selectable']) return
  })
}

const onMouseClick = (e) => {
  const intersects = raycaster.intersectObjects(scene.children)
  console.log('intersects', intersects)
  const tooltip = document.getElementById('tooltip')
  if (!intersects.length) return (tooltip.innerHTML = '')
  const { userData } = intersects[0].object
  if (userData['name']) {
    tooltip.innerHTML = `
       ${userData['name']}
    `
    tooltip.style.left = e.clientX + 'px'
    tooltip.style.top = e.clientY + 'px'
  } else tooltip.innerHTML = ''
  if (!userData['clickable']) return
  if (userData['name'].indexOf('door') !== -1) {
    const { rotation } = intersects[0].object
    new Tween.Tween(rotation)
      .to({ y: !userData['state'] ? userData['rotationY'] : 0 }, 2000)
      .easing(Tween.Easing.Elastic.Out)
      .onUpdate(() => {})
      .onComplete(() => {
        userData['state'] = 1 - userData['state']
      })
      .start()
  }
}

/* animate */
const animate = (time) => {
  raycaster.setFromCamera(pointer, camera)

  Tween.update(time)

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

init()
