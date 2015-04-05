const int numOfBones = @NUMBONES;

const float PI = 3.14195;

uniform vec3 bones[ numOfBones ];

varying vec3 vNorm;
varying float vDot;

$cubicCurve
$getBonePosition

void main(){
 
  //TODO: Get this thing working proper 

  // first get the centerPosition
  vec3 cp = getBonePosition( position.y );
    
  vec3 cpUp = getBonePosition( position.y - .001 );
  vec3 cpDo = getBonePosition( position.y + .001 );

  vec3 dUp = cp - cpUp;
  vec3 dDo = cp - cpDo;

  float d = dot( normalize( dUp) , normalize(dDo) );

 
  //vDot = d;
  vec3 x = vec3( 0. );
  vec3 z = vec3( 0. );
  
  if( abs(d) < 2. ){


    vDot = 1.;
    x = vec3( -1. , 0. , 0. );
    z = vec3( 0. , 0. , 1. );

  }else{
  
    vDot = .5;
    vec3 dir = normalize( dUp );

    x = normalize( cross( dir , normalize( dDo ) ) );
    z = normalize( cross( x , dir ) );

  }
  float t = position.x * 2. * PI;

  float xAmount = cos( t );
  float zAmount = sin( t );
 
  float r =.3* (1. - position.y );


  vec3 pos = cp + xAmount * r * x + zAmount * r * z;

  vNorm = normalize(pos - cp);

 // pos = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1. );


}
