function Wing( spine , left , params ){

  this.left = left;
  this.bones = [];
  
  this.body = new THREE.Object3D();

  this.v1 = new THREE.Vector3();
  this.v2 = new THREE.Vector3();
  this.v3 = new THREE.Vector3();
  this.v4 = new THREE.Vector3();

 
 
  this.wingUniforms = {

    t_pos:    { type: "t" , value: null },
    t_oPos:   { type: "t" , value: null },
    t_ooPos:  { type: "t" , value: null },

    bones:    { type:"v3v" , value:[]    },
    spine:    { type:"v3v" , value:[]    },

  } 

  var size = params.numBones;
  var span = params.wingSpan;
  var wingSpineDepth = 3;

  this.createBones( size , span );

  for( var i = 0; i < wingSpineDepth; i++ ){

    this.wingUniforms.spine.value.push( spine.bones[i].position );

  }
  
  this.soulSize = 32;

  var vs = shaders.setValue( params.vs.wing , 'SIZE' , this.soulSize ); 
  this.wingGeometry = this.createWingGeometry( this.soulSize );
  this.wingMaterial = new THREE.ShaderMaterial({
  
    uniforms: this.wingUniforms,
    vertexShader: vs,
    fragmentShader: params.fs.wing,
    side: THREE.DoubleSide


  });

  this.wing = new THREE.Mesh( this.wingGeometry , this.wingMaterial ); 
  
  
  var ss = shaders.setValue( params.ss.wing , 'NUMBONES' , size ); 
  ss = shaders.setValue( ss , 'NUMSPINE' , wingSpineDepth ); 
  this.soul = new PhysicsRenderer( 
    this.soulSize, 
    ss, 
    renderer 
  );


  this.soul.setUniform( 'bones' , this.wingUniforms.bones ); 
  this.soul.setUniform( 'spine' , this.wingUniforms.spine ); 
  this.soul.setUniform( 'dT' , dT ); 
  this.soul.setUniform( 'time' , time ); 
  this.soul.addBoundTexture( this.wingUniforms.t_pos   , 'output'    );
  this.soul.addBoundTexture( this.wingUniforms.t_oPos  , 'oOutput'   );
  this.soul.addBoundTexture( this.wingUniforms.t_ooPos , 'ooOutput'  );

  this.resetWing();

 // this.body.add( this.soul.debugScene );
  this.soul.debugScene.scale.multiplyScalar( .1 );
  this.soul.debugScene.position.z = - 5;
 
  this.body.add( this.wing ); 


  var slices = params.armSlices;
  var sides  = params.armSides;

  this.armGeometry = this.createArmGeometry( slices , sides ); 

  var vs = shaders.setValue( params.vs.arm , 'NUMBONES' , params.numBones );

  this.armMaterial = new THREE.ShaderMaterial({

    uniforms: this.wingUniforms,
    vertexShader: vs,
    fragmentShader: params.fs.arm

  }); 
 
  this.arm = new THREE.Mesh( this.armGeometry , this.armMaterial );


  this.body.add( this.arm ); 

}


Wing.prototype.resetWing = function(){


  var size = size || 100;
  var data = new Float32Array( this.soulSize * this.soulSize * 4 );

  for( var i = 0; i < this.soulSize; i++ ){
    for( var j = 0; j < this.soulSize; j++ ){

      data[ ( i * this.soulSize + j) * 4 + 0 ] = -i * .1;
      data[ ( i * this.soulSize + j) * 4 + 1 ] = -j * .1;
      data[ ( i * this.soulSize + j) * 4 + 2 ] = 0;
      data[ ( i * this.soulSize + j) * 4 + 3 ] = 0;
  
    }
  }

  var texture = new THREE.DataTexture( 
    data,
    this.soulSize,
    this.soulSize,
    THREE.RGBAFormat,
    THREE.FloatType
  );

  texture.minFilter =  THREE.NearestFilter,
  texture.magFilter = THREE.NearestFilter,

  texture.needsUpdate = true;
 
  this.soul.reset( texture);


}
Wing.prototype.createWingGeometry = function( size){

  var positions = new Float32Array( (size - 1) * (size-1) * 3 * 2 * 3 );

  for( var i = 0; i < size-1; i++ ){
    for( var j = 0; j < size-1; j ++ ){

      var index = (i * (size-1)) + j;

      positions[ index * 3 * 2 * 3 + 3  ] = ( i + .5 ) / size; 
      positions[ index * 3 * 2 * 3 + 4  ] = ( j + .5 ) / size; 
      positions[ index * 3 * 2 * 3 + 5  ] = 0;

      positions[ index * 3 * 2 * 3 + 0  ] = ( i + .5 ) / size; 
      positions[ index * 3 * 2 * 3 + 1  ] = ( j + 1.5 ) / size; 
      positions[ index * 3 * 2 * 3 + 2  ] = 0; 

      positions[ index * 3 * 2 * 3 + 6  ] = ( i + 1.5 ) / size; 
      positions[ index * 3 * 2 * 3 + 7  ] = ( j + .5 ) / size; 
      positions[ index * 3 * 2 * 3 + 8  ] = 0;  

      positions[ index * 3 * 2 * 3 + 12 ] = ( i + 1.5 ) / size; 
      positions[ index * 3 * 2 * 3 + 13 ] = ( j + .5 ) / size; 
      positions[ index * 3 * 2 * 3 + 14 ] = 0;  

      positions[ index * 3 * 2 * 3 + 9  ] = ( i + .5 ) / size; 
      positions[ index * 3 * 2 * 3 + 10 ] = ( j + 1.5 ) / size; 
      positions[ index * 3 * 2 * 3 + 11 ] = 0;  

      positions[ index * 3 * 2 * 3 + 15 ] = ( i + 1.5 ) / size; 
      positions[ index * 3 * 2 * 3 + 16 ] = ( j + 1.5 ) / size; 
      positions[ index * 3 * 2 * 3 + 17 ] = 0;    


    }
  }

  var pos_a = new THREE.BufferAttribute( positions , 3 );


  var geo = new THREE.BufferGeometry();
  geo.addAttribute( 'position' , pos_a );
  
  return geo;

}


Wing.prototype.createArmGeometry = function( slices , sides ){


  var totalVerts = (slices-1) * sides * 3 * 2;
  // x is position around specific slice
  // y is position along spine
  // z is ?!??!?!
  var positions = new Float32Array( totalVerts * 3 );

  for( var i = 1; i < slices; i++ ){
    for( var j = 0; j < sides; j++ ){

      var index =( ((i-1) * sides) + j) * 3 * 2;

      var up = (j + 1) % sides;
      
      this.v1.set( j/sides, (i - .5 ) / slices  , 0 );
      this.v2.set( j/sides, ( i + .5 ) / slices  , 0 );
      this.v3.set( up/sides ,( i - .5) / slices , 0 );
      this.v4.set( up/sides , ( i + .5 ) / slices  , 0 );
     

      // Tri 1
      positions[ index * 3 + 0  ] = this.v1.x; 
      positions[ index * 3 + 1  ] = this.v1.y; 
      positions[ index * 3 + 2  ] = this.v1.z;

      positions[ index * 3 + 3  ] = this.v2.x; 
      positions[ index * 3 + 4  ] = this.v2.y; 
      positions[ index * 3 + 5  ] = this.v2.z;

      positions[ index * 3 + 6  ] = this.v3.x; 
      positions[ index * 3 + 7  ] = this.v3.y; 
      positions[ index * 3 + 8  ] = this.v3.z;


      // Tri 2
      positions[ index * 3 + 9  ] = this.v3.x; 
      positions[ index * 3 + 10 ] = this.v3.y; 
      positions[ index * 3 + 11 ] = this.v3.z;

      positions[ index * 3 + 12 ] = this.v2.x; 
      positions[ index * 3 + 13 ] = this.v2.y; 
      positions[ index * 3 + 14 ] = this.v2.z;

      positions[ index * 3 + 15 ] = this.v4.x; 
      positions[ index * 3 + 16 ] = this.v4.y; 
      positions[ index * 3 + 17 ] = this.v4.z;

    }
  }

  var geo = new THREE.BufferGeometry();

  var posA = new THREE.BufferAttribute( positions , 3 );

  geo.addAttribute( 'position' , posA );



  return geo;


}



Wing.prototype.createBones = function( size , span ){
 
  var geo = new THREE.IcosahedronGeometry( .1 , 1 );
  var mat = new THREE.MeshNormalMaterial();

  for( var i = 0; i < size; i++ ){

    var bone = new THREE.Mesh( geo , mat );

    //this.body.add( bone );

    bone.velocity = new THREE.Vector3();

    if( this.left == true ){
      bone.position.x = -span * i / size;
    }else{
      bone.position.x = span * i / size;
    }

    bone.position.y = Math.sin( 2.1 *  Math.PI * ((i-7) / size) ); 

    this.bones.push( bone );
    this.wingUniforms.bones.value.push( bone.position );

  }



}


Wing.prototype.update = function( size ,  time ){

    this.bones[ 0 ].position.z = Math.sin( time ) * size;

    for( var i = 1; i < this.bones.length; i++ ){

    this.v1.copy( this.bones[ i - 1 ].position );
    this.v1.sub( this.bones[ i ].position );
    this.v1.multiplyScalar( .1  );

    //this.v2.set( 0 , 0 ,  Math.sin( time ) * .1 * ( 1 / i ) );
    //this.v1.add( this.v2 );

    //console.log( this.v1 );

    this.bones[ i ].velocity.z += this.v1.z;

    this.bones[i].velocity.multiplyScalar( .6 );

  }


  for( var i = 1; i < this.bones.length; i++ ){

    this.bones[i].position.add( this.bones[i].velocity );

  }

  this.soul.update();


}

