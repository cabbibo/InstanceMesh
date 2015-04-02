vec2 connectionUV( in vec2 uv , out vec2 uvOut1 , ou){

  float size = 1. / 32.;
  float mIx = floor( (uv.x) / size );
  float mIy = floor( (uv.y) / size );

  // Main Index
  vec2 mI = vec2( mIx , mIy );

  // If we are in the first column ( spine )
  if( mI.x < 1.){


    // If we are the upper most spine
    // We are connected to the leader
    if( mI.y < 1.){
    
      // return a negative number to know that its no a uv
      return vec2( -1. , -1. );

    }else{

      // Every other vertabrae in the spine
      // Gets attracted to the one above it
      return vec2( uv.x , uv.y - size );
   
   
    }


}

 // If we are in the first column ( spine )
  if( mI.x < 1.){


    // If we are the upper most spine
    // We are connected to the leader
    if( mI.y < 1.){

      vec3 attract = springForce( leader.xyz , pos.xyz , .01 );
      force += attract * 1000.;

    
    // Every other vertabrae in the spine
    // Gets attracted to the one above it
    }else{

      vec4 otherPos = texture2D( t_pos , vec2( uv.x , uv.y - size ) ); 
      
      vec3 attract = springForce( otherPos.xyz , pos.xyz , .01 );
      force += attract * 1000.;

      //force += flow * ( 1. -  uv.y);

    }


  // The 'sub' objects
  }else{

    // first level
    if( mI.x < 5. ){

      vec4 otherPos = texture2D( t_pos , vec2( hSize , uv.y ) );
 
      // Attract to the column
      vec3 attract = springForce( otherPos.xyz , pos.xyz , .04 );
      force += attract * 1000.;

      // Get the 'index' of this verta 
      // in the 4 first level sub objects
      int index = int( (uv.x - hSize ) / size );

 

      // Loop through all the other objects in this level
      for( int i = 0; i < 4; i++ ){

        // As long as we are not looking at ourself,
        // repel the other ones
        if( (i - index) != 0 ){

          float lookup = (float(i) * size) -  hSize;

          vec4 otherPos = texture2D( t_pos , vec2( lookup , uv.y ) );

          vec3 attract = springForce(  pos.xyz , otherPos.xyz , .2 );

          force -= attract * 2000.;  
        
        }
      }


    // The 'Sub Sub' objects
    }else if( mI.x < 21. ){


      // Which chunk

      int index = int( ( uv.x - (5.* size) ) / size );

      float chunk = floor( float( index / 4) );

      float lookup = (chunk * size) + size;

      vec4 otherPos = texture2D( t_pos , vec2( lookup , uv.y ) );

      vec3 attract = springForce( otherPos.xyz , pos.xyz , .3  );

      force += attract * 1000.;

      int indexInChunk = index - int( chunk * 4. );

      for( int i = 0; i < 4; i++ ){

        if( (i - indexInChunk) != 0 ){

          float lookup = (float(i) * size) + (size*4. + hSize) + (chunk * 4. * size);

          vec4 otherPos = texture2D( t_pos , vec2( lookup , uv.y ) );

          vec3 attract = springForce( pos.xyz , otherPos.xyz  , .8 );

          force -= attract * 3000.;           
        }

      }


     
    // Bundle around spine
    }else{


       vec4 otherPos = texture2D( t_pos , vec2( hSize , uv.y ) );


      vec3 attract = springForce( otherPos.xyz , pos.xyz , .1  );

      force +=  attract * 300.;

      int index = int( ( uv.x - (21.* size) ) / size );
      

      for( int i = 0; i < 11; i++ ){

        if( i-index != 0 ){

          float lookup = ( float(i) * size ) + ( size * 21. + hSize );

          vec4 otherPos = texture2D( t_pos , vec2( lookup , uv.y ) );

          vec3 attract = springForce( pos.xyz , otherPos.xyz  , .1 );

          force -= attract * 800.;  

        }

      }

    }

