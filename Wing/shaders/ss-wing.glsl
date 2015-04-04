const int numOfBones = @NUMBONES;
const int numOfSpine = @NUMSPINE;

uniform vec2 resolution;

uniform sampler2D t_oPos;
uniform sampler2D t_pos;

uniform vec3 bones[ numOfBones ];
uniform vec3 spine[ numOfSpine ];

uniform float dT;

const float dampening = .9;
const float springMultiplier=100.;
const float maxVel = .1;


$springForce
$getSurrounding
$cubicCurve
$getBonePosition
$getSpinePosition

void main(){

  float iSize = 1. / resolution.x;

  // Spring length
  float sl =  .2;
  float power = 2.;

  vec2 uv = gl_FragCoord.xy / resolution;

  vec4 oPos = texture2D( t_oPos , uv );
  vec4 pos  = texture2D( t_pos  , uv );

  vec3 vel  = pos.xyz - oPos.xyz;
  vec3 p    = pos.xyz;


  vec3 f = vec3( 0. );

  f += vec3( 0. , -.1 , 0. );


  if( uv.x > iSize ){

    vec3 p1 = texture2D( t_pos , vec2( uv.x - iSize , uv.y )).xyz;
    vec3 nP = springForce(  p , p1 , sl );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }
 
  }
  
  if( uv.x < 1. - iSize ){

    vec3 p1 = texture2D( t_pos , vec2( uv.x + iSize , uv.y )).xyz;
    vec3 nP = springForce(  p , p1 , sl );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }

  
  }

  if( uv.y > 1.5 * iSize ){

    vec3 p1 = texture2D( t_pos , vec2( uv.x , uv.y - iSize)).xyz;
    vec3 nP = springForce(  p , p1 , sl );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }

  
  
  }

  if( uv.y < 1. - iSize ){

    vec3 p1 = texture2D( t_pos , vec2( uv.x , uv.y + iSize)).xyz;
    vec3 nP = springForce(  p , p1 , sl );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }

 
  }

  if( uv.y < 1. - iSize && uv.x < 1. - iSize ){

    vec3 p1 = texture2D( t_pos , vec2( uv.x + iSize , uv.y + iSize)).xyz;
    vec3 nP = springForce(  p , p1 , pow( 2. * sl*sl , .5 )  );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }
  }

  if( uv.y > iSize && uv.x < 1. - iSize ){

    vec3 p1 = texture2D( t_pos , vec2( uv.x + iSize , uv.y - iSize)).xyz;
    vec3 nP = springForce(  p , p1 , pow( 2. * sl*sl , .5 )  );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }


  }

  if( uv.y > iSize && uv.x > iSize ){

    vec3 p1 = texture2D( t_pos , vec2( uv.x - iSize , uv.y - iSize)).xyz;
    vec3 nP = springForce(  p , p1 , pow( 2. * sl*sl , .5 )  );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }

  }
  
  if( uv.y < 1. - iSize && uv.x > iSize ){

    vec3 p1 = texture2D( t_pos , vec2( uv.x - iSize , uv.y + iSize)).xyz;

    vec3 nP = springForce(  p , p1 , pow( 2. * sl*sl , .5 )  );
    if( length( nP ) > .0001 ){
      f += springMultiplier *  normalize( nP ) * pow( length( nP ) , power );
    }

  }
 
  vel += f*min( .1 , dT);
  vel *= dampening;

  if( length( vel ) > maxVel ){

    vel = normalize( vel ) * maxVel;

  }
  p += vel * 1.;//speed;*/

  vec3 o = getSurrounding( uv , resolution.x );
  vec3 oDif = o - p;
  p += oDif * .0003;

  if( uv.y < 1.5 *  iSize   ){
    p = getBonePosition( uv.x );
  }

  /*p = getBonePosition( uv.x );
  p.y -= uv.y * 10.;*/

  if( uv.x < 1.5 * iSize ){
  
    p = getSpinePosition( uv.y );
  }


  gl_FragColor = vec4( p , 0.);

}
