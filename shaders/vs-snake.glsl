
attribute vec2 lookup;

uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform sampler2D t_ooPos;

varying vec3 vNorm;

void main(){

  // instance position
  vec3 iPos   = texture2D( t_pos   , lookup ).xyz;
  vec3 ioPos  = texture2D( t_oPos  , lookup ).xyz;
  vec3 iooPos = texture2D( t_ooPos , lookup ).xyz;

  // getting the difference between pos and oldPos
  vec3 d1 = iPos  - ioPos;
  vec3 d2 = ioPos - iooPos;

  vec3 z = normalize( d1 );
  vec3 x = normalize( cross( normalize( d1 ) , normalize( d2 ) ) );
  vec3 y = cross( z , x );
  
  mat3 rot = mat3(
    x.x , x.y , x.z ,
    y.x , y.y , y.z ,
    z.x , z.y , z.z
  );
  

  vNorm = rot * normal;

  vec3 pos = iPos + rot * position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );

}
