varying vec3 vNorm;

void main(){


  vec3 col = vNorm * .5 + .5;

 // vec3 col = vec3( abs( vDot / 1. ) );
  gl_FragColor = vec4( col , 1. );

}
