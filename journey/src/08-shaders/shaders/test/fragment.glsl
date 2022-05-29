// 浮点数的精度
// precision mediump float;

// varying float vRandom; //vertex中定义的变量

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv; //vertex中定义的vUv

varying float vElevation;

void main() {
  // gl_FragColor = vec4(1.0, 1.0, 0.0, 0.56);
  // gl_FragColor = vec4(vRandom * 0.5, vRandom, 0.0, 0.56);
  // gl_FragColor = vec4(uColor, 0.56);

  //texture
  //从texture中取色
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb += vElevation * 1.2 + 0.7;
  gl_FragColor = textureColor;

}
