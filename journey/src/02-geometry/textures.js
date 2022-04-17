/**
 * @description textures
 */
export default ({ THREE, scene }) => {
  const texture = new THREE.TextureLoader().load('/assets/textures/arkit.png')
  texture.center.x = 0.5
  texture.center.y = 0.5
  texture.offset.x = 0.5
  texture.offset.y = 0.5
  texture.rotation = Math.PI / 4
  texture.wrapS = THREE.RepeatWrapping //水平对于uv的v
  texture.wrapT = THREE.RepeatWrapping //垂直对应uv的u
  texture.repeat.set(1, 1)

  texture.generateMipmaps = false //不生成mipmap
  texture.minFilter = THREE.NearestFilter //当覆盖小于1像素，贴图的采用方式（远处）
  texture.magFilter = THREE.NearestFilter //当覆盖大于1像素，贴图的采用方式（近处）

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(5, 0, 0)
  scene.add(mesh)
}
