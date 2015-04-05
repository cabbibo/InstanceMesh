function Spine( params ){

  this.bones = [];
  
  this.body = new THREE.Object3D();

  this.v1 = new THREE.Vector3();
  this.v2 = new THREE.Vector3();
  this.v3 = new THREE.Vector3();
  this.v4 = new THREE.Vector3();

 

  var geo = new THREE.IcosahedronGeometry( .1 , 1 );
  var mat = new THREE.MeshNormalMaterial();

  this.spineUniforms = {
    
    bones:    { type:"v3v" , value:[]    },
    time: time
  
  }


  this.numBones = params.numBones;
  for( var i = 0; i < this.numBones; i++ ){

    var bone = new THREE.Mesh( geo , mat );

    //this.body.add( bone );

    bone.velocity = new THREE.Vector3();

    bone.position.y = -(i / this.numBones ) * 40. ; 

    this.bones.push( bone );
    this.spineUniforms.bones.value.push( bone.position );
  
  }

  
  var slices = params.spineSlices;
  var sides  = params.spineSides;
  this.spineGeometry = this.createSpineGeometry( slices , sides );


  console.log( this.numBones);
  var vs = shaders.setValue( params.vs.spine , 'NUMBONES' , this.numBones ); 

  this.spineMaterial = new THREE.ShaderMaterial({

    uniforms:       this.spineUniforms,
    vertexShader:   vs,
    fragmentShader: params.fs.spine,
    //side: THREE.DoubleSide
    

  });

  this.spine = new THREE.Mesh( this.spineGeometry , this.spineMaterial );


  this.body.add( this.spine );


  this.scales = new Scales( this , {

    sides: params.scaleSides,
    slices: params.scaleSlices,
    vertexShader: params.vs.scales,
    fragmentShader: params.fs.scales,

  }); 

  this.body.add( this.scales.body );

}

Spine.prototype.createSpineGeometry = function( slices , sides ){


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


Spine.prototype.update = function( size ,  time ){

    this.bones[ 0 ].position.z = Math.sin( time ) * size;

    for( var i = 1; i < this.bones.length; i++ ){

    this.v1.copy( this.bones[ i - 1 ].position );
    this.v1.sub( this.bones[ i ].position );
    this.v1.multiplyScalar( .05  );

    //this.v2.set( 0 , 0 ,  Math.sin( time ) * .1 * ( 1 / i ) );
    //this.v1.add( this.v2 );

    //console.log( this.v1 );

    this.bones[ i ].velocity.z += this.v1.z;

    this.bones[i].velocity.multiplyScalar( .6 );

  }


  for( var i = 1; i < this.bones.length; i++ ){

    this.bones[i].position.add( this.bones[i].velocity );

  }


}
