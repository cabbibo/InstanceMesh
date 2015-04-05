function Scales( spine , params ){
    
 var geo = this.createGeometry( params.sides );

 var attributes = this.createAttributes( params.slices ); 

 var uniforms = spine.spineUniforms;

 var vs = shaders.setValue( params.vertexShader , 'NUMBONES' , spine.numBones );

 var fs = params.fragmentShader;
 this.body = new InstanceMesh( 
  geo,
  attributes,
  uniforms,
  vs,
  fs,
  { side: THREE.DoubleSide }
 );
 
 this.body.frustumCulled = false;

}

Scales.prototype.createAttributes = function( slices ){

  var ids = new Float32Array( slices );

  for( var i = 0; i < slices; i++ ){

    ids[ i ]  = (i + .5) / slices;

  }

  var attributes = {
    id : { type:"f" , data: ids }
  }

  return attributes

}
Scales.prototype.createGeometry = function( amount ){

  var v1 = new THREE.Vector3();
  var v2 = new THREE.Vector3();
  var v3 = new THREE.Vector3();

  var v4 = new THREE.Vector3();

  var nor = new THREE.Vector3();

  var totalVerts = amount * 3

  var positions = new Float32Array( totalVerts * 3 );
  var normals = new Float32Array( totalVerts * 3 );

  for( var i = 0; i < amount; i++ ){

    var t   = (i / amount )* 2 * Math.PI;
    var tUp = ((( i + .8 ) % amount ) / amount) * 2 * Math.PI;

    var x = Math.cos( t );
    var z = Math.sin( t );

    var xUp = Math.cos( tUp );
    var zUp = Math.sin( tUp );

    var xAve = (x + xUp)/2;
    var zAve = (z + zUp)/2;

    v1.set( x , 0 , z );
    v2.set( xUp , 0 , zUp ); 


    // Last part of plate goes down
    v3.set( xAve * 1.2 , -.5 , zAve * 1.2 );


    v4.copy( v3 );

    v4.sub( v1 );

    nor.copy( v3 );
    nor.sub( v2 );

    nor.cross( v4 );

    nor.normalize();

    positions[ i * 3 * 3 + 0 ] = v1.x;
    positions[ i * 3 * 3 + 1 ] = v1.y;
    positions[ i * 3 * 3 + 2 ] = v1.z;
    
    positions[ i * 3 * 3 + 3 ] = v2.x;
    positions[ i * 3 * 3 + 4 ] = v2.y;
    positions[ i * 3 * 3 + 5 ] = v2.z;
   
    positions[ i * 3 * 3 + 6 ] = v3.x;
    positions[ i * 3 * 3 + 7 ] = v3.y;
    positions[ i * 3 * 3 + 8 ] = v3.z;


    normals[ i * 3 * 3 + 0 ] = nor.x;
    normals[ i * 3 * 3 + 1 ] = nor.y;
    normals[ i * 3 * 3 + 2 ] = nor.z;
    
    normals[ i * 3 * 3 + 3 ] = nor.x;
    normals[ i * 3 * 3 + 4 ] = nor.y;
    normals[ i * 3 * 3 + 5 ] = nor.z;
   
    normals[ i * 3 * 3 + 6 ] = nor.x;
    normals[ i * 3 * 3 + 7 ] = nor.y;
    normals[ i * 3 * 3 + 8 ] = nor.z;


  }

  var geo = new THREE.BufferGeometry();

  var posA = new THREE.BufferAttribute( positions , 3 );
  var norA = new THREE.BufferAttribute( normals   , 3 );

  geo.addAttribute( 'position' , posA );
  geo.addAttribute( 'normal' , norA );

  return geo;

}
