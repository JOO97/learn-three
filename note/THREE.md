# THREE.js



## 1基本概念

camera摄像头-视角

scene场景

renderer渲染





# 2程序架构

## 1场景Scene

- 网格模型Mesh 
  - 几何体geometry
  - 材质material
- 光照
  - 颜色
  - 分类

## 2相机Camera

- 位置
- 视线方向
- 投影方式
  - 投射
  - 正射

## 3渲染Renderer

- 渲染器创建 WebGLRenderer()
- 开始渲染 render()
- domElement属性-canvas对象



## 3请求动画帧



## 4鼠标控制三维场景





## DEMO

### 1全景图

`CSS3DRenderer`

1. init
   1. init camera
   2. init scene
   3. create css 3D object - 定义6个面 `+-X` `+-Y` `+-Z`
   4. add object to scene
   5. init renderer
   6. append renderer to body
2. animate
   1. requestAnimationFrame
   2. 将角度转换为弧度函数
   3. camera look at target
   4. renderer.render





### 2地月环绕

OribitControls

CSS2DRenderer

CSS2DObject

new THREE.clock() 时钟

new THREE.TextureLoader() 纹理加载器



### init

相机：实例化、位置

场景：实例化

光源：实例化、位置、亮度、阴影、添加到场景中

月球：实例化球体、设置材质、合并球体和材质为Mesh、添加到场景中

渲染器：实例化、设置像素比、大小、渲染阴影=true、渲染器添加到body中

标签渲染器

控制器：实例化

动画

