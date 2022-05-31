# THREE.js

支持 WebGL、Canvas2D、SVG、CSS3D 渲染器

babylon.js 3d 游戏引擎

# 三维概念

#### pitch/heading/roll

- pitch是围绕X轴旋转，也叫做俯仰角，
- heading(yaw)是围绕Y轴旋转，也叫偏航角，(平行于z轴，就是水平旋转的，其他同理)
- roll是围绕Z轴旋转，也叫翻滚角，





# 基础

1. camera 相机-视角

   ```javascript
   const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
   ```

2. scene 场景

继承于 THREE.Object3D(网格和材质不继承于 Object3D)

```javascript
const scene = new THREE.Scene()
```

3. renderer 渲染器

```javascript
const renderer = new THREE.WebGLRenderer({
  antialias: trye //开启抗锯齿
})
```

3. 物体
   - 创建几何体
   - 创建材质
   - 组合为网格
   - 网格添加到场景中

# 工具

1. 性能检测插件 `stats`

FPS 浏览器每秒 60 帧

https://www.wjceo.com/lib/js/libs/stats.min.js

```javascript
//性能监听插件
const stats = new Stats()
document.body.appendChild(stats.dom)

function animate() {
  requestAnimationFrame(animate)
  stats.update()
  renderer.render(scene, camera)
}
```

2. 调试工具 `dat.gui`

https://github.com/dataarts/dat.gui

```javascript
/**
 * dat.gui
 */
const gui = new dat.GUI({ closed: true, width: 400 })
//处理颜色
const parameters = {
  color: 0xff0000,
  spin: () => {
    console.log('spin')
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 })
  }
}
gui.addColor(parameters, 'color').onChange(() => {
  //threejs中color是一个类, 通过set()来修改
  console.log(material.color)
  material.color.set(parameters.color)
})

gui.add(parameters, 'spin')
```

```javascript
const controls = {
  positionX: 0,
  positionY: 0,
  positionZ: 0
}
function initGUI() {
  gui = new dat.GUI()
  gui.add(controls, 'positionX', -10, 10).onChange(updatePosition)
  gui.add(controls, 'positionY', -1, 1).onChange(updatePosition)
  gui.add(controls, 'positionZ', -1, 1).onChange(updatePosition)
}
function updatePosition() {
  mesh.position.set(controls.positionX, controls.positionY, controls.positionY)
}
```

# 核心

## Object3D

threejs 中大部分对象的基类

```javascript
const object3D = new THREE.Object3D()
```

属性： position rotation scale quaternion(4 元数-用于表示旋转) castShadow(是否接收阴影) children 等

# 数学库

## Color

# Sence

`THREE.Object3D`

three.js 将每个能够之间添加到场景内的对象都继承一个基类 THREE.Object3D

继承于 THREE.Object3D(网格和材质不继承于 Object3D)

1. 添加 3d 对象到场景中/在 3d 对象中添加 3d 对象

```javascript
scene.add(mesh)
mesh.add(cMesh)
```

2. 获取一个 3d 对象

```
scene.getObjectByName('item')
```

3. 删除

```javascript
mesh.visible = false //1
scene.remove(mesh) //2
```

4. 修改大小

```javascript
//拉伸
//1
mesh.scale.x = 2
mesh.scale.y = 0.5
mesh.scale.z = 2
//2
mesh.scale.set(2, 0.5, 2)
//3
mesh.scale = new THREE.Vector3(2, 0.5, 2)
```

5. 修改位置

```javascript
//修改位置
//1
mesh.position.set(0, 0, 0)
//2
mesh.position.x = 2
mesh.position.y = 2
mesh.position.z = -2
//3
mesh.position = new THREE.Vector3(2, 2, -2)
```

6. 修改转向

```javascript
mesh.rotation.x += 0.01
mesh.rotation.y += 0.02
```

# camera

## 涉及概念

1. Viewing frustum `视锥体`

   - 任何落在图像边缘的发散线之外的物体对摄像机而言均不可见，但是针对摄像机渲染的内容还有另外两个限制。`近剪裁面`和`远剪裁面`平行于摄像机的 XY 平面，两者沿中心线相隔一定的距离。比近剪裁面更靠近摄像机的任何对象以及比远裁剪面更远离摄像机的任何对象都不会被渲染。

     ![image-20220416114701693](https://tva1.sinaimg.cn/large/e6c9d24egy1h1bf213ondj20br07j74e.jpg)

## 相机

### camera 基类

继承于 THREE.Object3D

![image-20220313225621652](https://tva1.sinaimg.cn/large/e6c9d24ely1h08nbwrr1mj20bt08pgm9.jpg)

![image-20220313224539844](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n0tzpivj20co0dumxo.jpg)

### OrthographicCamera 正交相机

无论物体距离相机距离远或者近，在最终渲染的图片中物体的大小都保持不变

```javascript
const distance = 10
const aspect = window.innerWidth / window.innerHeight
const camera = new THREE.OrthographicCamera(
  (distance * aspect) / -2, //left
  (distance * aspect) / 2, //right
  (distance * aspect) / 2, //top
  (distance * aspect) / -2, //bottom
  0.1,
  100
)
```

![image-20220313230236421](https://tva1.sinaimg.cn/large/e6c9d24ely1h08nieqq0gj20bl014mx1.jpg)

![image-20220313230306440](https://tva1.sinaimg.cn/large/e6c9d24ely1h08nixogh3j20bw0dqjsh.jpg)

### PerspectiveCamera 透视相机

```javascript
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
```

![image-20220313230212073](https://tva1.sinaimg.cn/large/e6c9d24ely1h08nhzmoflj20bo0e0gmk.jpg)

### -StereoCamera 立体相机

双透视摄像机（立体相机）常被用于创建[3D Anaglyph](https://en.wikipedia.org/wiki/Anaglyph_3D)（3D 立体影像） 或者[Parallax Barrier](https://en.wikipedia.org/wiki/parallax_barrier)（视差屏障）

### -CubeCamera 立方相机

创建 6 个渲染到 WebGLCubeRenderTarget 的摄像机

### -ArrayCamera 摄像机阵列

ArrayCamera 用于更加高效地使用一组已经预定义的摄像机来渲染一个场景。这将能够更好地提升 VR 场景的渲染性能。
一个 ArrayCamera 的实例中总是包含着一组子摄像机，应当为每一个子摄像机定义**viewport**（视口）这个属性，这一属性决定了由该子摄像机所渲染的视口区域的大小

## controls

#### OrbitControls（轨道控制器）

可以使得相机围绕目标进行轨道运动

# Geometry 几何体

一个模型由几何体 Geometry 和材质 Material 组成

### Geometry 和 BufferGeometry

![image-20220313224635016](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n1rb57nj20cq0f2aar.jpg)

### BufferGeometry

性能更高

```javascript
//1 创建BufferGeometry 2 创建顶点数组, 存入顶点数据 3 设置position属性
const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
```

### BoxGeometry 立方体

BoxGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)

width — X 轴上面的宽度，默认值为 1。
height — Y 轴上面的高度，默认值为 1。
depth — Z 轴上面的深度，默认值为 1。
widthSegments — （可选）宽度的分段数，默认值是 1。
heightSegments — （可选）高度的分段数，默认值是 1。
depthSegments — （可选）深度的分段数，默认值是 1。

```
THREE.BoxGeometry(w,h,d,wSegments,hSegments,zSegments)
//segemnt各个轴上的切割份数
```

### 圆形

![image-20220313224702196](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n27jvo5j20c706sjrm.jpg)

### 圆锥

![image-20220313224717958](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n2h39vyj20c10763yu.jpg)

### 圆柱

### 球

![image-20220313224738439](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n2ty7s9j20bs07aq38.jpg)

### 平面

![image-20220313224810335](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n3e3f57j20c1064mxb.jpg)

### 圆环

![image-20220313224823023](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n3lo93uj20bw06imxc.jpg)

### Text

fontLoader()

TextGeometry

```javascript
  
  const fontLoader = new FontLoader()

  fontLoader.load(
    '/assets/fonts/gentilis_regular.typeface.json',
    (font) => {
      const textGeometry = new TextGeometry('MOON START', {
        font,
        size: 0.4,
        height: 0.1,
        curveSegments: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.3,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegment: 5
      })
      const mesh = new THREE.Mesh(textGeometry, material)
      //居中
      textGeometry.center()
        scene.add(dount)
      }
    },
    (xhr) => {
      // console.log('on progress', xhr)
    },
    (err) => {
      console.log('err')
    }
  )
```



# Texture

### 涉及概念

1. mipmap 多级渐远纹理技术

   优点：当物体远离时，无需高精度纹理展示时，则替换低精度纹理，降低了显存带宽，减少了渲染。

   缺点：为了适配多场景（远近个不同的场景）提前生成八张精度不同的纹理，使用一定的空间用用于存储这些多级渐远纹理，通 常会多占用 33%的内存空间，典型的利用空间换取时间的办法

2. uv

   uv 坐标： UV 坐标是指所有的图象文件都是二维的一个平面。水平方向是 U，垂直方向是 V，通过这个平面的，二维的 UV 坐标系。我们可以定位图象上的任意一个象素。

   uv unwrapping：

3. PBR-Physically-Based Rendering（基于物理的渲染）

### 加载 texture

1.Image

2.Textloader

```javascript
const texture = new THREE.TextureLoader().load('/assets/textures/arkit.png')
texture.center.x = 0.5 //旋转中心点 默认值为(0,0)
texture.center.y = 0.5
texture.offset.x = 0.5
texture.offset.y = 0.5
texture.rotation = Math.PI * 2
texture.wrapS = THREE.RepeatWrapping //水平对于uv的v
texture.wrapT = THREE.RepeatWrapping //垂直对应uv的u
texture.repeat.set(1, 1)

texture.generateMipmaps = false //不生成mipmap
texture.minFilter = THREE.NearestFilter //当覆盖小于1像素，贴图的采用方式（远处）
texture.magFilter = THREE.NearestFilter //当覆盖大于1像素，贴图的采用方式（近处）

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(2, 0, 0)
scene.add(mesh)
```

LoadingManager 加载管理器

# Material 材质

![image-20220313224841515](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n3xnowuj20bk01rq2w.jpg)

### 不受灯光影响的材质

1. MeshBasicMaterial

![image-20220313224951277](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n55b4ygj20by07eglw.jpg)

2. MeshNormalMaterial

![image-20220313225010918](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n5hcil8j20bt03vdft.jpg)

3. LineBasicMaterial

THREE.LineBasicMaterial 线段材质

```javascript
//线段
const pointsArr = [
  new THREE.Vector3(-1, 0, -5),
  new THREE.Vector3(2, 2, -5),
  new THREE.Vector3(3, 1, -5),
  new THREE.Vector3(1, 0, -5)
]
const line = new THREE.BufferGeometry()
line.setFromPoints(pointsArr)
const lineMate = new THREE.LineBasicMaterial({ color: 'blue' })
const lineMesh = new THREE.Line(line, lineMate)
lineMesh.position.set(2, 2, 0)
scene.add(lineMesh)
```

### 受灯光影响的材质

1. MeshLamberMaterial

![image-20220313225223907](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n7s5l9ij20bk02vwei.jpg)

2. MeshPhongMaterial

![image-20220313225246707](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n86s40sj20bk02qmx6.jpg)

# render

# 光照

![image-20220313225321174](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n8s2a1cj20bk092jrz.jpg)

1. 平行光

以特定的方向发射的光，产生的光都是平行的状态。模拟太阳光线

![image-20220313225403669](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n9ivmm5j20br07174q.jpg)

2. 全局环境光

照亮场景中的所有物体，在计算物体颜色时会叠加上环境光的颜色。

环境光作用于所有物体，所有材质，所以环境光没有方向，也无法产生阴影

![image-20220313225344733](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n96t7zlj20bo02f0sp.jpg)

3. 添加阴影效果

![image-20220313225428960](https://tva1.sinaimg.cn/large/e6c9d24ely1h08n9ylmtmj20bu08dglx.jpg)

4. 点光源

![image-20220313225452253](https://tva1.sinaimg.cn/large/e6c9d24ely1h08nad325ej20bx0d40tp.jpg)

5. 聚光灯

![image-20220313225513965](https://tva1.sinaimg.cn/large/e6c9d24ely1h08nastmvaj20c40dwdgw.jpg)

![image-20220313225536122](https://tva1.sinaimg.cn/large/e6c9d24ely1h08nb46v4qj20bu05emxa.jpg)

6. 室外光源

![image-20220313225551494](https://tva1.sinaimg.cn/large/e6c9d24ely1h08nbdnt2oj20c607amxl.jpg)

# Points 粒子

![image-20220313225939245](https://tva1.sinaimg.cn/large/e6c9d24ely1h08nfc1dizj20bw0cx3zf.jpg)

# 导入模型

1. Json
2. GLTF

![image-20220313230026563](https://tva1.sinaimg.cn/large/e6c9d24ely1h08ng609a0j20bn0b9dgm.jpg)

![image-20220313230038692](https://tva1.sinaimg.cn/large/e6c9d24ely1h08ngczpnvj20bl072aae.jpg)

# 动画

### 变形动画

![image-20220313225833798](https://tva1.sinaimg.cn/large/e6c9d24ely1h08ne7awxcj20bo0f8t9o.jpg)

### 骨骼动画

### 导入动画

![image-20220313225738969](https://tva1.sinaimg.cn/large/e6c9d24ely1h08nd985mnj20bx0e6gmf.jpg)

### 补间动画

![image-20220313225756986](https://tva1.sinaimg.cn/large/e6c9d24ely1h08ndki1c9j20bp0cuq3k.jpg)

![image-20220313225810445](https://tva1.sinaimg.cn/large/e6c9d24ely1h08nds8213j20bj045a9z.jpg)

# 程序架构

### 1 场景 Scene

- 网格模型 Mesh
  - 几何体 geometry
  - 材质 material
- 光照
  - 颜色
  - 分类

### 2 相机 Camera

- 位置
- 视线方向
- 投影方式
  - 投射
  - 正射

### 3 渲染 Renderer

- 渲染器创建 WebGLRenderer()
- 开始渲染 render()
- domElement 属性-canvas 对象

### 3 请求动画帧

### 4 鼠标控制三维场景

# DEMO

### 1 全景图

`CSS3DRenderer`

1. init
   1. init camera
   2. init scene
   3. create css 3D object - 定义 6 个面 `+-X` `+-Y` `+-Z`
   4. add object to scene
   5. init renderer
   6. append renderer to body
2. animate
   1. requestAnimationFrame
   2. 将角度转换为弧度函数
   3. camera look at target
   4. renderer.render

### 2 地月环绕

OribitControls

CSS2DRenderer

CSS2DObject

new THREE.clock() 时钟

new THREE.TextureLoader() 纹理加载器

流程：

相机：实例化、位置

场景：实例化

光源：实例化、位置、亮度、阴影、添加到场景中

月球：实例化球体、设置材质、合并球体和材质为 Mesh、添加到场景中

渲染器：实例化、设置像素比、大小、渲染阴影=true、渲染器添加到 body 中

标签渲染器

控制器：实例化

动画

### 3 三维场景搭建与开发流程

1. class Base3d
2. hdr 图 全景背景图
3. RBGELoader 加载 hdr
4. gltf 三维模型
5. GLTFLoader 模型加载器
6.

### 4 游戏

fbx 文件

1. 初始化场景、相机、渲染器
2. 添加灯光：环境光、平行光
3. 添加草地图片

   - THREE.TextureLoader().load(url)
   - 赋值给材质的 map 属性
   - 图片默认垂直加载，需要旋转

4. 添加人物模型

   - 加载 fbx 文件 THREE.FBXLoader().load(mesh=>{})

     - 创建动画 生成 mixer = mesh.mixer = new THREE.AnimationMixer(mesh)
     - 取出 mesh 中的动画，anction[i] = mixer.clipAction(mesh.animations[i])
     - 执行动画 action[i].play()

   - 在 render 中添加对应的 render 方法

     - const clock = new THREE.Clock()

     - ```javascript
       function render() {
         let time = clock.getDelta()
         if (mixer) {
           mixer.update(time)
         }
       }
       ```

   - 操作杆

     `Dop`兼容 pc 端和移动端

     - 绑定事件
     -

xs





t

