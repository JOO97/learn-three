# THREE.js



## 1基本概念

camera摄像头-视角

scene场景

renderer渲染



## 2全景图流程

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