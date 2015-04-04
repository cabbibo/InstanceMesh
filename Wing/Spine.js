function Spine(){

  this.bones = [];
  
  this.body = new THREE.Object3D();

  this.v1 = new THREE.Vector3();
  this.v2 = new THREE.Vector3();

 

  var geo = new THREE.IcosahedronGeometry( .1 , 1 );
  var mat = new THREE.MeshNormalMaterial();

  for( var i = 0; i < 20; i++ ){

    var bone = new THREE.Mesh( geo , mat );

    this.body.add( bone );

    bone.velocity = new THREE.Vector3();

    bone.position.y = -(i / 20 ) * 40. ; 

    this.bones.push( bone );
  
  }



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
