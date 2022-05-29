/**
 * @description Shader Patterns
 */

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { gui, renderer, camera, scene, controls, directionLight } from './init'

//shader
import vertexShader from './shaders/water/vertex.glsl'
import fragmentShader from './shaders/water/fragment.glsl'

/**
 * texture
 */
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('/assets/models/duck/DuckCM.png')

const debugObj = {}

//Color
debugObj.depthColor = '#186691'
debugObj.surfaceColor = '#9bd8ff'

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: {
      value: 0
    },
    uBigWavesElevation: {
      value: 0.2
    },
    uBigWavesFrequency: {
      value: new THREE.Vector2(4, 1.5)
    },
    uBigWavesSpeed: {
      value: 0.5
    },
    //small waves
    uSmallWavesElevation: {
      value: 0.15
    },
    uSmallWavesFrequency: {
      value: 3
    },
    uSmallWavesSpeed: {
      value: 0.2
    },
    uSmallWavesIterations: {
      value: 4
    },

    uDepthColor: {
      value: new THREE.Color(debugObj.depthColor)
    },
    uSurfaceColor: {
      value: new THREE.Color(debugObj.surfaceColor)
    },
    uColorOffset: {
      value: 0.08
    },
    uColorMultiplier: {
      value: 5
    }
  }
  // transparent: true
  // wireframe: true
})
gui
  .add(material.uniforms.uBigWavesElevation, 'value')
  .min(0)
  .max(1.0)
  .step(0.01)
  .name('uBigWavesElevation')
gui
  .add(material.uniforms.uBigWavesFrequency.value, 'x')
  .min(0)
  .max(10.0)
  .step(0.01)
  .name('uBigWavesFrequency x')
gui
  .add(material.uniforms.uBigWavesFrequency.value, 'y')
  .min(0)
  .max(10.0)
  .step(0.01)
  .name('uBigWavesFrequency z')
gui
  .add(material.uniforms.uBigWavesSpeed, 'value')
  .min(0)
  .max(4.0)
  .step(0.01)
  .name('uBigWaves speed')

gui
  .addColor(debugObj, 'depthColor')
  .name('depthColor')
  .onChange(() => {
    material.uniforms.uDepthColor.value.set(debugObj.depthColor)
  })
gui
  .addColor(debugObj, 'surfaceColor')
  .name('surfaceColor')
  .onChange(() => {
    material.uniforms.uSurfaceColor.value.set(debugObj.surfaceColor)
  })
gui.add(material.uniforms.uColorOffset, 'value').min(0).max(1.0).step(0.01).name('uColorOffset')
gui
  .add(material.uniforms.uColorMultiplier, 'value')
  .min(0)
  .max(10.0)
  .step(0.01)
  .name('uColorMultiplier')

gui
  .add(material.uniforms.uSmallWavesElevation, 'value')
  .min(0)
  .max(1.0)
  .step(0.01)
  .name('uSmallWavesElevation')
gui
  .add(material.uniforms.uSmallWavesFrequency, 'value')
  .min(0)
  .max(30.0)
  .step(0.01)
  .name('uSmallWavesFrequency')
gui
  .add(material.uniforms.uSmallWavesSpeed, 'value')
  .min(0)
  .max(4.0)
  .step(0.01)
  .name('uSmallWavesSpeed')
gui
  .add(material.uniforms.uSmallWavesIterations, 'value')
  .min(0)
  .max(8)
  .step(1)
  .name('uSmallWavesIterations')

const geometry = new THREE.PlaneBufferGeometry(2, 2, 128, 128)

const plane = new THREE.Mesh(geometry, material)
plane.scale.y = 2 / 3
plane.rotation.x = -Math.PI / 2
// plane.receiveShadow = true
console.log('geometry', geometry)

directionLight.shadow.camera.far = 30
directionLight.shadow.mapSize.set(1024, 1024)
scene.add(new THREE.AxesHelper(100), plane)

/**
 * animates
 */
let clock = new THREE.Clock()
let prev = 0
function animate() {
  const elapsedTime = clock.getElapsedTime()
  const delta = elapsedTime - prev
  prev = elapsedTime

  material.uniforms.uTime.value = elapsedTime

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
