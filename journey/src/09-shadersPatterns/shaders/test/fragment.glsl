
#define PI 3.1415926535

varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.54531223);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}



void main() {
  // gl_FragColor = vec4(vUv, 1.0, 1.0); // 1
  // gl_FragColor = vec4(vUv, 0.0, 1.0); // 2
  // 3
  // float strength = vUv.x;
  // 4
  // float strength = vUv.y;
  // 5
  // float strength = 1.0 - vUv.y;
  // 6
  // float strength = 10.0 * vUv.y;
  // 7 NOTE:
  // float strength = mod(vUv.y * 10.0, 1.0);
  //8
  // float strength = mod(vUv.y * 10.0, 1.0);
  // strength = step(0.5, strength); //小于0.5取0 大于0.5取1
  //9
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
  //10
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
  // strength += step(0.8, mod(vUv.y * 10.0, 1.0));
  //11
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
  // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
  //12
  // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
  // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
  //13
  //  float x = step(0.4, mod(vUv.x * 10.0, 1.0));
  // x *= step(0.8, mod(vUv.y * 10.0, 1.0));
  //   float y = step(0.8, mod(vUv.x * 10.0, 1.0));
  // y *= step(0.4, mod(vUv.y * 10.0, 1.0));
  // float strength = x+ y;
  // 14
   float x = step(0.4, mod(vUv.x * 10.0, 1.0));
  x *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
    float y = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
  y *= step(0.4, mod(vUv.y * 10.0, 1.0));
  float strength = x + y;
  //15
  // float strength = abs(vUv.x - 0.5);
  //16
  // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
  //17
  // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
  //18
  // float strength = step(0.2,max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  //19
  // float suqare1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // float suqare2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // float strength = suqare1 * suqare2;
  //20
  // float strength = floor(vUv.x * 10.0) / 10.0;
  //21
  // float strength = floor(vUv.x * 10.0) / 10.0;
  // strength += floor(vUv.y * 10.0) / 10.0;

  //22
  // float strength = random(vUv);

  //23
  // vec2 grid = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
  // float strength = random(grid);

  //24
  // float strength = length(vUv);

  //25
  // float strength = distance(vUv, vec2(0.5));
  //26
  // float strength = 1.0 - distance(vUv, vec2(0.5));

  //27
  // float strength = 0.015 / distance(vUv, vec2(0.5)) + 0.25;
  //28
  // vec2 lightUv = vec2(
  //   vUv.x * 0.1 + 0.45,
  //   vUv.y * 0.5 + 0.25
  // );
  // float strength = 0.015 / distance(lightUv, vec2(0.5)) + 0.25;

  //29
  // vec2 lightUvX = vec2(
  //   vUv.x * 0.1 + 0.45,
  //   vUv.y * 0.5 + 0.25
  // );
  // float lightX = 0.015 / distance(lightUvX, vec2(0.5)) + 0.25;
  // vec2 lightUvY = vec2(
  //   vUv.y * 0.1 + 0.45,
  //   vUv.x * 0.5 + 0.25
  // );
  // float lightY = 0.015 / distance(lightUvY, vec2(0.5)) + 0.25;
  // float strength = lightX * lightY;

  // 30
  // vec2 rotateUv = rotate(vUv, PI / 4.0, vec2(0.5));

  // vec2 lightUvX = vec2(
  //   rotateUv.x * 0.1 + 0.45,
  //   rotateUv.y * 0.5 + 0.25
  // );
  // float lightX = 0.015 / distance(lightUvX, vec2(0.5)) + 0.25;
  // vec2 lightUvY = vec2(
  //   rotateUv.y * 0.1 + 0.45,
  //   rotateUv.x * 0.5 + 0.25
  // );
  // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
  // float strength = lightX * lightY;

  //31
  // float strength = step(0.25, distance(vUv, vec2(0.5)));
  //32
  // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
  //33
  // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
  //34
  // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
  //35
  // vec2 waveUv = vec2(
  //   vUv.x,
  //   vUv.y + sin(vUv.x * 30.0) / 10.0
  // );
  // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
  //36
  // vec2 waveUv = vec2(
  //   vUv.x + sin(vUv.y * 30.0) / 10.0,
  //   vUv.y + sin(vUv.x * 30.0) / 10.0
  // );
  // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
  //37
  // vec2 waveUv = vec2(
  //   vUv.x + sin(vUv.y * 100.0) / 10.0,
  //   vUv.y + sin(vUv.x * 100.0) / 10.0
  // );
  // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

  //40
  // float angle = atan(vUv.x, vUv.y); //获取角度
  // float strength = angle;
  //41
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // float strength = angle;
  //42
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // float strength = angle;
  //43
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // angle *= 20.0;
  // angle = mod(angle, 1.0);
  // float strength = angle;
  //44
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // float strength = sin(angle * 100.0);

  //45
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= PI * 2.0;
  // angle += 0.5;
  // float sinusoid = sin(angle * 100.0);
  // float radius = 0.25 + sinusoid * 0.02;
  // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

  //TODO:46 Perlin noise 柏林噪声
  // float strength = vUv.x;

  //mixed color
  strength = clamp(strength, 0.0, 1.0);  //限制strength大小

  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(vUv, 1.0);
  vec3 mixedColor = mix(blackColor, uvColor, strength);
  gl_FragColor = vec4(mixedColor, 1.0);



  // gl_FragColor = vec4(strength, strength, strength, 1.0);
}
