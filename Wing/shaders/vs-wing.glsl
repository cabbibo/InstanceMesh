
uniform sampler2D t_pos;
varying vec2 vUv;
void main(){

  vec3 p = texture2D( t_pos , position.xy ).xyz;

vUv = position.xy;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( p , 1. );

}
