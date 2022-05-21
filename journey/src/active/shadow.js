/**
 * @description shadow
 */
/**
 * 1. 根据shadow map来添加shadow
 * 2. example https://threejs.org/examples/?q=shadowmap#webgl_shadowmap_viewer
 * 3. point spot direction三种支持shadow
 * 4. 设置阴影： 渲染器、物体、光
 * 5. 优化shadow
 *    1. shadow.mapSize, 默认是512x512
 *    2. shadow.camera: near far top left right bottom
 * 6. shadowMap类型
 *    1. PCShadowMap
 *    2. PCFSoftShadowMap
 *    3. BasicShadowMap
 *    4. VSMShadowMap
 * 7. baking shadow: 多个阴影整合到texture中
 */
import * as THREE from 'three'

export default ({ scene, gui, renderer }) => {}
