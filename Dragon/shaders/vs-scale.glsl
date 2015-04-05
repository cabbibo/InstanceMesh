attribute float id;

const int numOfBones = @NUMBONES;

const float PI = 3.14195;

uniform vec3 bones[ numOfBones ];
uniform float time;


varying vec3 vNorm;

$cubicCurve
$getBonePosition

void main(){
  

  // first get the centerPosition
  vec3 cp = getBonePosition( id );
    
  vec3 cpUp = getBonePosition( id - .001 );
  vec3 cpDo = getBonePosition( id + .001 );

  vec3 dUp = cp - cpUp;
  vec3 dDo = cp - cpDo;

  float d = dot( normalize( dUp)  , normalize(dDo) );

  vec3 x = vec3( 0. );
  vec3 z = vec3( 0. );
 
  // catches our errors 
  if( abs(d) < .0001 ){

    x = -vec3( 1. , 0. , 0. );
    z = vec3( 0. , 0. , 1. );

  }else{
  
    vec3 dir = normalize( dUp );

    x = -normalize( cross( dir , normalize( dDo ) ) );
    z = normalize( cross( x , dir ) );

  }
    
  vec3 y = -normalize( dUp );

  mat3 rot = mat3(
    x.x , x.y , x.z ,
    y.x , y.y , y.z ,
    z.x , z.y , z.z
  );

   
  vNorm = rot * normal;

  float extraSize = max( (1.-id) * .38 , pow( id , 2. ) * 10. * ((sin(time *10. - id * 100. )* .4+1.) * pow( (1. - id), 3.)) );

   
  
  vec3 pos = (rot * position) * extraSize + cp;// vec3( 0. , -id , 0. );

 // pos = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );


}
