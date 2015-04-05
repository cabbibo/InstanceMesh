
varying vec2 vUv;
varying vec3 vNorm;

void main(){

  
  vec3 col = vNorm * .5 + .5;
  gl_FragColor = vec4( col ,1. );

}
