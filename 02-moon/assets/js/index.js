let camera, scene, renderer

//相机聚焦点
let target = new THREE.Vector3()
//经纬度
let lon = 90,
  lat = 0
//聚焦点 弧度制
let phi = 0,
  theta = 0

// 移动端
let touchX, touchY

/* 以下六个面 拼接成立方体 */
var sides = [
  {
    position: [-512, 0, 0] /* 左 */,
    rotation: [0, Math.PI / 2, 0]
  },
  {
    position: [512, 0, 0] /* 右 */,
    rotation: [0, -Math.PI / 2, 0]
  },
  {
    position: [0, 512, 0] /* 上 */,
    rotation: [Math.PI / 2, 0, Math.PI]
  },
  {
    position: [0, -512, 0] /* 下 */,
    rotation: [-Math.PI / 2, 0, Math.PI]
  },
  {
    position: [0, 0, 512] /* 后 */,
    rotation: [0, Math.PI, 0]
  },
  {
    position: [0, 0, -512] /* 前 */,
    rotation: [0, 0, 0]
  }
]

init()
animate()

// 初始化
function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  scene = new THREE.Scene()
  sides.forEach((item, index) => {
    let el = document.getElementById('surface_' + index)
    el.width = 1026
    var css3Loader = new THREE.CSS3DObject(el)
    css3Loader.position.fromArray(item.position) //位置
    css3Loader.rotation.fromArray(item.rotation) //角度
    scene.add(css3Loader)
  })
  //init css 3d renderer
  renderer = new THREE.CSS3DRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  //init event
  initEvent()
}

//动画
function animate() {
  requestAnimationFrame(animate)
  lat = Math.max(-85, Math.min(85, lat))
  //角度转换为弧度函数
  phi = THREE.Math.degToRad(90 - lat)
  theta = THREE.Math.degToRad(lon)
  target.x = Math.sin(phi) * Math.cos(theta)
  target.y = Math.cos(phi)
  target.z = Math.sin(phi) * Math.sin(theta)

  camera.lookAt(target)
  renderer.render(scene, camera)
}

function initEvent() {
  document.addEventListener('mousedown', onDocumentMouseDown, false)
  document.addEventListener('wheel', onDocumentMouseWheel, false)
  document.addEventListener('touchstart', onDocumentTouchStart, false)
  document.addEventListener('touchmove', onDocumentTouchMove, false)
  window.addEventListener('resize', onWindowResize, false)
}

//鼠标按住事件 - 监听鼠标移动/提起
function onDocumentMouseDown(e) {
  e.preventDefault()

  document.body.style.cursor = 'move'

  document.addEventListener('mousemove', onDocumentMouseMove, false)
  document.addEventListener('mouseup', onDocumentMouseUp, false)
}

function onDocumentMouseMove(event) {
  var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
  var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0

  /* 拖动速度随相机视角的变动而变动 */
  var speed = camera.fov * 0.0015

  /* 经纬度平移速度 */
  lon -= movementX * speed
  lat += movementY * speed
}

function onDocumentMouseUp(event) {
  event.preventDefault()

  document.body.style.cursor = 'auto'

  document.removeEventListener('mousemove', onDocumentMouseMove)
  document.removeEventListener('mouseup', onDocumentMouseUp)
}

function onDocumentMouseWheel(e) {
  /* 缩放速度 */
  var speed = 0.008

  var fov = camera.fov + event.deltaY * speed

  /* 角度缩放最值 */
  camera.fov = THREE.Math.clamp(fov, 45, 95)

  camera.updateProjectionMatrix()
}

function onDocumentTouchStart(e) {
  e.preventDefault()

  var touch = e.touches[0]

  touchX = touch.screenX
  touchY = touch.screenY
}

function onDocumentTouchMove(e) {
  e.preventDefault()

  var touch = e.touches[0]

  lon -= (touch.screenX - touchX) * 0.1
  lat += (touch.screenY - touchY) * 0.1

  touchX = touch.screenX
  touchY = touch.screenY
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}
