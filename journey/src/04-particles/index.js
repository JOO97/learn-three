/**
 * @description Particles
 */

import * as THREE from 'three'
import { TetrahedronGeometry } from 'three'
import { gui, renderer, camera, scene, controls } from './init'

camera.position.y = 2
camera.position.z = 2
camera.position.x = 0
camera.fov = 45

/**
 * texture
 */
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('/circle_02.png')

/**
 * create particles
 */

const particlesGeometry = new THREE.SphereBufferGeometry(1, 32, 32)
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  alphaMap: particlesTexture,
  transparent: true
})
// particlesMaterial.color = new THREE.Color(0xff0000)
const particles = new THREE.Points(particlesGeometry, particlesMaterial)

/**
 * crate particles by bufferGeometry
 */
const particlesGeometry2 = new THREE.BufferGeometry()
const count = 5000
const position = new Float32Array(count * 3)
//colors
const colors = new Float32Array(count * 3) //rgb

for (let index = 0; index < position.length; index++) {
  position[index] = (Math.random() - 0.5) * 6
  colors[index] = Math.random()
}
particlesGeometry2.setAttribute('position', new THREE.BufferAttribute(position, 3))
particlesGeometry2.setAttribute('color', new THREE.BufferAttribute(colors, 3))

particlesMaterial.vertexColors = true
/**
 * 优化particles的texture
 */

//不渲染透明的部分,默认会将texture中透明的部分渲染但是透明度为0
// particlesMaterial.alphaTest = 0.001
// particlesMaterial.depthTest = false //不考虑particles的前后位置(问题：在其他物体后面的particles不会被遮挡）
particlesMaterial.depthWrite = false //告诉webgl不要绘制在depth buffer中的particles
particlesMaterial.blending = THREE.AdditiveBlending //叠加颜色

const particles2 = new THREE.Points(particlesGeometry2, particlesMaterial)

scene.add(new THREE.AxesHelper(100), particles2)
/**
 * animates
 */
console.log('particlesGeometry2.attributes.position', particlesGeometry2.attributes.position)
let clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()
  /**
   * animate particles
   */
  // particles2.rotation.y = elapsedTime * 0.2
  for (let index = 0; index < position.length; index++) {
    const i3 = index * 3
    const x = particlesGeometry2.attributes.position.array[i3]
    //QA
    particlesGeometry2.attributes.position.array[i3 + 1] = Math.sin(elapsedTime * x)
  }
  //NOTE:
  particlesGeometry2.attributes.position.needsUpdate = true
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
