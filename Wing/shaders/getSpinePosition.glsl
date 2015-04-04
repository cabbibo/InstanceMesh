vec3 getSpineFromArray( int x ){
  
  for( int i  = 0; i < numOfSpine; i++ ){
    if( i == x ){
      return spine[i];
    } 
  }

}

vec3 getSpinePosition( float x  ){

  float base = x * float( numOfSpine ) ;//size;
  float baseUp = floor( base );
  float baseDown = ceil( base );
  float amount = base - baseUp;
 
  vec3 p0 = vec3(0.);
  vec3 v0 = vec3(0.);
  vec3 p1 = vec3(0.);
  vec3 v1 = vec3(0.);

  vec3 p2 = vec3(0.);
   
  if( baseUp == 0. ){

    p0 = getSpineFromArray( int( baseUp )         );
    p1 = getSpineFromArray( int( baseDown )       );
    p2 = getSpineFromArray( int( baseDown + 1. )  );
    
    //v0 = 0
    v1 = .5 * ( p2 - p0 ); 


  }else if( int( baseDown ) == numOfSpine ){

    p0 = getSpineFromArray( int( baseUp )         );
    p1 = getSpineFromArray( int( baseDown )       );
    p2 = getSpineFromArray( int( baseDown - 1. )  );

    // v1 = 0;
    v0 = .5 * ( p1 - p2 );


  }else{

    vec3 pM = vec3( 0. );

    p0 = getSpineFromArray( int( baseUp )         );
    p1 = getSpineFromArray( int( baseDown )       );

    pM = getSpineFromArray( int( baseUp - 1. )    );
    p2 = getSpineFromArray( int( baseDown + 1. )  );
 
    v1 = .5 * ( p2 - p0 );
    v0 = .5 * ( p1 - pM );

  }

  vec3 c0 = p0;
  vec3 c1 = p0 + v0/3.;
  vec3 c2 = p1 - v1/3.;
  vec3 c3 = p1;
  
  vec3 position = cubicCurve( amount , c0 , c1 , c2 , c3 );

  return position;


}
