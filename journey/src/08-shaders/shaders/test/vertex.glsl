// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

//不能传递过大的数值
uniform vec2 uFrequency; //自定义unfirom
uniform float uTime;

// attribute vec3 position;
attribute float aRandom; //自定义属性

// varying float vRandom; //将定义的varying发送给fragment

//texture
// attribute vec2 uv;
varying vec2 vUv;

varying float vElevation;

/*
gl_Position包含顶点信息
*/
void main() {
  //modelMatrix Mesh相关的变换: position rotation scale
  vec4 modelPos = modelMatrix * vec4(position, 1.0);

  //将凸起位置保存到elevation
  float elevation = sin(modelPos.x * uFrequency.x - uTime) * 0.1;
  elevation += sin(modelPos.y * uFrequency.y -uTime) * 0.1;

  modelPos.z += elevation;
  // modelPos.z += sin(modelPos.x * uFrequency.x - uTime) * 0.1;
  // modelPos.z += sin(modelPos.y * uFrequency.y -uTime) * 0.1;
  // modelPos.z += aRandom * 0.5;


  //viewMatrix camrea相关的变化: position、rotation、near、far、field of view
  vec4 viewPos = viewMatrix * modelPos;
  //projectionMatrix 将坐标转换为空间坐标
  vec4 projectionPos = projectionMatrix * viewPos;

  gl_Position = projectionPos;

  vUv = uv;

  vElevation = elevation;

  // vRandom = aRandom;



// float getFloat(float a, float b) {
//   return a * b;
// }
  // // 基本类型
  // float a = 10.0;
  // int b = 10;
  // float c = a * float(b);
  // bool flag = true;

  // //vec2
  // vec2 foo = vec2(1, 2.0); //vec(2.0)
  // foo.x = 2.0; //NOTE: 一定要是浮点数
  // foo.y = 5.2;
  // foo *= 2.0; //(4.0, 10.4)

  // //vec3
  // vec3 bar = vec3(0.0);
  // vec3 bar2 = vec3(0.0,1.0,3.0);
  // //color
  // vec3 color = vec3(0.0);
  // color.r = 0.5;
  // color.g = 0.7;
  // color.b = 0.1;

  // vec3 vec3FromVec2 = vec3(foo, 1.0);
  // vec2 vec2FromVec3 = bar.xy;
  // //vec4
  // vec4 bar4 = vec4(1.0); //x,y,z,w(a)

  // //function
  // float fn = getFloat(1.0, 2.2);

}
