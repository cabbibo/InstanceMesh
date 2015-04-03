 

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

  console.log( params );

  // to know if we are added to scene or not.
  this.active = false;

  // Do error checking for params
  this.checkParams( params );


  var bodyUniforms = {

    t_pos   : { type: "t" , value: null },
    t_oPos  : { type: "t" , value: null },
    t_ooPos : { type: "t" , value: null }

  }


  for( var propt in params.uniforms ){

    this.addUniforms( params.uniforms[ propt ] , bodyUniforms );

  }


  var lookupSize = 32;//Math.ceil( Math.sqrt( params.instanceNumber ) );

  console.log( params.renderer );
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
 

  var spineAttributes = this.createSpineAttributes( 32 ); 

  this.spine = new InstanceMesh(
    params.geos.spine,
    spineAttributes,
    params.uniforms.spine,
    params.vs.spine,
    params.fs.spine
  );

  this.spine.frustumCulled = false; 
 
 
  var subAttributes = this.createSubAttributes( 32 ); 

  this.sub = new InstanceMesh(
    params.geos.sub,
    subAttributes,
    params.uniforms.sub,
    params.vs.sub,
    params.fs.sub
  );

  this.sub.frustumCulled = false; 

 
  var subSubAttributes = this.createSubSubAttributes( 32 ); 

  this.subSub = new InstanceMesh(
    params.geos.subSub,
    subSubAttributes,
    params.uniforms.subSub,
    params.vs.subSub,
    params.fs.subSub,
    { side: THREE.DoubleSide}
  );

  this.subSub.frustumCulled = false;

  var bundleAttributes = this.createBundleAttributes( 32 ); 

  this.bundle = new InstanceMesh(
    params.geos.bundle,
    bundleAttributes,
    params.uniforms.bundle,
    params.vs.bundle,
    params.fs.bundle
  );

  this.bundle.frustumCulled = false; 

 
   
  
  
  this.body = new THREE.Object3D();

  this.body.add( this.spine   );
  this.body.add( this.sub     );
  this.body.add( this.subSub  );
  this.body.add( this.bundle  );

  this.body.frustumCulled = false;

  this.soul.debugScene.scale.multiplyScalar( .016 );
  this.soul.debugScene.position.z = -2.5;

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

  if( !params.renderer          ){ console.log( 'no renderer provided'        ); } 
  if( !params.simulationShader  ){ console.log( 'no sim shader provided'      ); } 

}

Snake.prototype.createSpineAttributes = function( numOf ){


  var lookups   = new Float32Array( numOf * 2 );
  var lookupSize = Math.ceil( Math.sqrt( numOf ) );
        
  for( var i = 0; i < numOf; i++ ){
      
    var y = i / numOf;
     
    var a = .5 / numOf;

    lookups[ i * 2 + 0 ] =  a;
    lookups[ i * 2 + 1 ] = y + a;
      
  }


  var attributes = {

    lookup: { type:"v2" , data: lookups }

  }

  return attributes;

}


Snake.prototype.createSubAttributes = function( numOf ){


  var lookups   = new Float32Array( numOf * 4 * 2 );
  var lookupSize = Math.ceil( Math.sqrt( numOf ) );
        
  for( var i = 0; i < numOf; i++ ){
     
   for( var j = 0; j < 4; j++ ){ 
    
    var y = i / numOf;
    var x = (j + 1 )/ numOf
    var a = .5 / numOf;

    lookups[ ( i * 4 + j ) * 2 + 0 ] = x + a;
    lookups[ ( i * 4 + j ) * 2 + 1 ] = y + a;
   
   }
      
  }


  var attributes = {

    lookup: { type:"v2" , data: lookups }

  }

  return attributes;

}

//1 + 16 + 4 = 21
Snake.prototype.createSubSubAttributes = function( numOf ){


  var lookups   = new Float32Array( numOf * 16 * 2 );
  var lookupSize = Math.ceil( Math.sqrt( numOf ) );
        
  for( var i = 0; i < numOf; i++ ){
     
   for( var j = 0; j < 16; j++ ){ 
    var y = i / numOf;
    var x = (j + 5 )/ numOf
    var a = .5 / numOf;

    lookups[ ( i * 16 + j ) * 2 + 0 ] = x + a;
    lookups[ ( i * 16 + j ) * 2 + 1 ] = y + a;
   }
      
  }


  var attributes = {

    lookup: { type:"v2" , data: lookups }

  }

  return attributes;

}

Snake.prototype.createBundleAttributes = function( numOf ){


  var lookups   = new Float32Array( numOf * 11 * 2 );
  var lookupSize = Math.ceil( Math.sqrt( numOf ) );
        
  for( var i = 0; i < numOf; i++ ){
     
   for( var j = 0; j < 11; j++ ){ 
    var y = i / numOf;
    var x = (j + 21 )/ numOf
    var a = .5 / numOf;

    lookups[ ( i * 11 + j ) * 2 + 0 ] = x + a;
    lookups[ ( i * 11 + j ) * 2 + 1 ] = y + a;
   }
      
  }


  var attributes = {

    lookup: { type:"v2" , data: lookups }

  }

  return attributes;

}
