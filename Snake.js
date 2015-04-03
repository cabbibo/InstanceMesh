 

/*


      params = {

        geometry: 
        instanceNumber
        renderer:
        vertexShader:
        fragmentShader:
        simulationShader:
        bodyUniforms:
        soulUniforms:

      }


*/


function Snake( params ){


  // to know if we are added to scene or not.
  this.active = false;

  // Do error checking for params
  this.checkParams( params );


  var bodyUniforms = {

    t_pos   : { type: "t" , value: null },
    t_oPos  : { type: "t" , value: null },
    t_ooPos : { type: "t" , value: null }

  }

  if( params.bodyUniforms ){

    this.addUniforms( bodyUniforms , params.bodyUniforms );

  }

  var lookupSize = 32;//Math.ceil( Math.sqrt( params.instanceNumber ) );

  this.soul = new PhysicsRenderer( 
    lookupSize, 
    params.simulationShader , 
    params.renderer 
  );

  this.soul.addBoundTexture( bodyUniforms.t_pos   , 'output'    );
  this.soul.addBoundTexture( bodyUniforms.t_oPos  , 'oOutput'   );
  this.soul.addBoundTexture( bodyUniforms.t_ooPos , 'ooOutput'  );

  this.soul.resetRand( .2 );

  if( params.soulUniforms ){ this.soul.setUniforms( params.soulUniforms ); }
  

  var geometry = this.createGeometry( params.geometry , params.instanceNumber );

  var material = new THREE.ShaderMaterial({
  
    uniforms: bodyUniforms,

    attributes: {
      lookup: { type:"v2" , value: null }
    },

    vertexShader:   params.vertexShader,
    fragmentShader: params.fragmentShader,

    side: THREE.DoubleSide 

  });


  this.body = new THREE.Mesh( geometry , material );
  this.body.frustumCulled = false;

  this.soul.debugScene.scale.multiplyScalar( .016 );
  this.soul.debugScene.position.z = -2.5;
  ///this.body.add( this.soul.debugScene );

}

Snake.prototype.debug = function(){
  this.body.add( this.soul.debugScene );

}
Snake.prototype.update = function(){

  if( this.active == true ){
    this.soul.update();
  }

}

Snake.prototype.activate = function( scene ){

  scene.add( this.body );
  this.active = true;

}

Snake.prototype.deactivate = function( scene ){

  scene.remove( this.body );
  this.active = false;

}

Snake.prototype.addUniforms = function( uniforms , uniformsToAdd ){

  for( var propt in uniformsToAdd ){

    if( !uniforms[ propt ] ){

      uniforms[ propt ] = uniformsToAdd[ propt ];

    }else{

      console.log( 'You are trying to override a uniform that is needed' );
      console.log( 'Uniform Name: ' + propt );

    }

  }

}

Snake.prototype.checkParams = function( params ){

  if( !params.geometry          ){ console.log( 'no geometry provided'        ); } 
  if( !params.renderer          ){ console.log( 'no renderer provided'        ); } 
  if( !params.vertexShader      ){ console.log( 'no vert shader provided'     ); } 
  if( !params.fragmentShader    ){ console.log( 'no frag shader provided'     ); } 
  if( !params.simulationShader  ){ console.log( 'no sim shader provided'      ); } 
  if( !params.bodyUniforms      ){ console.log( 'no bodyUniforms provided'    ); } 
  if( !params.soulUniforms      ){ console.log( 'no soulUniforms provided'    ); } 

}

Snake.prototype.createGeometry = function( geometry  , numOf ){

  var faces = geometry.faces.length;

  // Get the totalVerts by looking up how many faces
  // we've got in the geometry

  var positions = new Float32Array( faces * 3 );
  var normals   = new Float32Array( faces * 3 );
  var lookups   = new Float32Array( numOf * 2 );


  var lookupSize = Math.ceil( Math.sqrt( numOf ) );

  for( var j = 0; j < faces; j++ ){

      var index =  j * 3;

      var face = geometry.faces[j];

      var p1 = geometry.vertices[ face.a ];
      var p2 = geometry.vertices[ face.b ];
      var p3 = geometry.vertices[ face.c ];

      var n1 = face.vertexNormals[ 0 ]; 
      var n2 = face.vertexNormals[ 1 ]; 
      var n3 = face.vertexNormals[ 2 ]; 
     
      positions[ index * 3  + 0 ] = p1.x;
      positions[ index * 3  + 1 ] = p1.y;
      positions[ index * 3  + 2 ] = p1.z;

      positions[ index * 3  + 3 ] = p2.x;
      positions[ index * 3  + 4 ] = p2.y;
      positions[ index * 3  + 5 ] = p2.z;

      positions[ index * 3  + 6 ] = p3.x;
      positions[ index * 3  + 7 ] = p3.y;
      positions[ index * 3  + 8 ] = p3.z;

      normals[ index * 3  + 0 ] = n1.x;
      normals[ index * 3  + 1 ] = n1.y;
      normals[ index * 3  + 2 ] = n1.z;

      normals[ index * 3  + 3 ] = n2.x;
      normals[ index * 3  + 4 ] = n2.y;
      normals[ index * 3  + 5 ] = n2.z;

      normals[ index * 3  + 6 ] = n3.x;
      normals[ index * 3  + 7 ] = n3.y;
      normals[ index * 3  + 8 ] = n3.z;
   
    } 
        
  for( var i = 0; i < numOf; i++ ){
      var y = (Math.floor( i / lookupSize ))/ lookupSize;
      var x = (i - ( (Math.floor( i / lookupSize )) * lookupSize )) / lookupSize;
    
       
      var a = .5 / lookupSize;

      lookups[ i * 2 + 0 ] = x + a;
      lookups[ i * 2 + 1 ] = y + a;
      
  }


  var geo = new THREE.InstancedBufferGeometry();

  var a_position  = new THREE.BufferAttribute( positions , 3 );
  var a_normal    = new THREE.BufferAttribute( normals   , 3 );
  var a_lookup    = new THREE.InstancedBufferAttribute( lookups, 2, 1, false );

  geo.addAttribute( 'position'  , a_position );
  geo.addAttribute( 'normal'    , a_normal   );
  geo.addAttribute( 'lookup'    , a_lookup   );


  return geo;

}
