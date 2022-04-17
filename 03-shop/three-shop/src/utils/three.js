import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//模型loader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class MyThree {
  constructor(target) {
    this.targetEl = document.querySelector(target)
    this.camera //相机
    this.scene //场景
    this.renderer //渲染器
    this.model //商品
    this.plate //盘子
    this.clock = new THREE.Clock() //时钟
    this.mixer //动画对象
    this.animateAction //动画行为
    this.init()
    this.animate()
  }
  init() {
    this.initCamera()
    this.initScene()
    this.initRender()
    this.initControl()
    this.addMesh()
    //窗口变化
    window.addEventListener('resize', this.onWindowResize.bind(this))
    // 监听滚轮事件
    window.addEventListener('mousewheel', this.onMouseWheel.bind(this))
  }
  render() {
    this.mixer && this.mixer.update(this.clock.getDelta())
    this.renderer.render(this.scene, this.camera)
  }
  animate() {
    // this.renderer.render(this.scene, this.camera)
    // requestAnimationFrame(this.animate)
    this.renderer.setAnimationLoop(this.render.bind(this))
  }
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    this.camera.position.set(1, 2, 1)
  }
  initScene() {
    this.scene = new THREE.Scene()
    //设置背景
    this.setEnvMap('000')
  }
  //设置全景背景图片 hdr
  setEnvMap(name) {
    new RGBELoader().setPath('./files/hdr/').load(`${name}.hdr`, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      this.scene.background = texture
      this.scene.environment = texture
    })
  }
  initRender() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.targetEl.appendChild(this.renderer.domElement)
  }
  initControl() {
    new OrbitControls(this.camera, this.renderer.domElement)
  }
  async addMesh() {
    await this.setModel('bag2.glb')
  }
  // 加载模型
  setModel(modelName) {
    return new Promise((resolve) => {
      const loader = new GLTFLoader().setPath('./files/gltf/')
      loader.load(
        modelName,
        (gltf) => {
          console.log(gltf)
          this.model = gltf.scene.children[0]
          gltf.scene.children[2].children[0].intensity = 1
          gltf.scene.children[3].children[0].intensity = 1
          gltf.scene.children[4].children[0].intensity = 1
          //当前摄像头修改为模型的摄像头
          this.camera = gltf.cameras[0]
          //手动调用动画
          this.mixer = new THREE.AnimationMixer(gltf.scene.children[1])
          this.animateAction = this.mixer.clipAction(gltf.animations[0])
          //设置动画播放时长
          this.animateAction.setDuration(20).setLoop(THREE.LoopOnce)
          //   设置播放完成之后停止
          this.animateAction.clampWhenFinished = true
          // 自动播放
          // this.animateAction.play()
          this.scene.add(gltf.scene)
          resolve(modelName + '加载成功')
        },
        (e) => {
          //获取模型当前加载进度
          console.log(e)
        }
      )
    })
  }
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
  onMouseWheel(e) {
    //计算当前所在位置
    // const time = this.animateAction.time
    // const duration = this.animateAction._clip.duration
    // const step = Math.floor((time / duration) * 4)
    // console.log(step, time, duration)
    const timeScale = e.deltaY > 0 ? 1 : -1
    this.animateAction.setEffectiveTimeScale(timeScale)
    this.animateAction.paused = false
    this.animateAction.play()
    if (this.timeoutid) {
      clearTimeout(this.timeoutid)
    }
    this.timeoutid = setTimeout(() => {
      this.animateAction.halt(0.5)
    }, 300)
  }
}

export default MyThree
