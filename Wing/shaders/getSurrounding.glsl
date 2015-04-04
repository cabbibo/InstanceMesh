vec3 getSurrounding( vec2 uv , float size ){

  float iSize = .5 / size;

  float amount = 0.;
  vec3 others = vec3( 0. );

  if( uv.x > iSize ){
    others += texture2D( t_pos , uv - vec2( iSize , 0. ) ).xyz;
    amount += 1.;
  }
   
  if( uv.x < 1.- iSize ){
    others += texture2D( t_pos , uv + vec2( iSize , 0. ) ).xyz;
    amount += 1.;
  }

  if( uv.y > iSize ){
    others += texture2D( t_pos , uv - vec2( 0. , iSize ) ).xyz;
    amount += 1.;
  }


  if( uv.y < 1. - iSize ){
    others += texture2D( t_pos , uv + vec2( 0. , iSize ) ).xyz;
    amount += 1.;
  }

  others /= amount;

  return others;


}
