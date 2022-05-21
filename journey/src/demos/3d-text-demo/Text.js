/**
 * @description 3D Text
 */
// http://gero3.github.io/facetype.js/
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

//FontLoader
//TextBufferGeometry

//属性
//curveSegments babelSegments

//居中
//1
//bounding
//computeBoundingBox
//移动geometry
//bevel属性会影响中心位置
//2
//textGeometry.center()

//性能优化
//console.time
//console.timeEnd

export default ({ THREE, scene }) => {
  const fontLoader = new FontLoader()
  const textureLoader = new THREE.TextureLoader()

  const texture = textureLoader.load('/assets/textures/matcaps/01.png')
  const material = new THREE.MeshMatcapMaterial()
  material.matcap = texture

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
      //FIXME 调用计算边界func得到undefined
      // console.log(textGeometry.computeBoundingSphere())

      scene.add(mesh)
      for (let i = 0; i < 100; i++) {
        const donutGeometry = new THREE.TorusGeometry(1.5, 1, 16, 100)
        const dount = new THREE.Mesh(donutGeometry, material)
        dount.position.set(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        )
        dount.rotation.x = Math.random() * Math.PI
        dount.rotation.y = Math.random() * Math.PI

        const scale = Math.random()
        dount.scale.set(scale, scale, scale)

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
}
