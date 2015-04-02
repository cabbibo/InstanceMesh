function SnakeLeaderLogic( head , leaders ){

  this.head     = head;
  this.leaders  = leaders;
  
  this.v1 = new THREE.Vector3();
  this.v2 = new THREE.Vector3();

  this.dampening = .93;

  this.forces = [];

  for( var i = 0; i < this.leaders.length; i++ ){ 
    this.forces.push( new THREE.Vector3() );
  }

  console.log( this.forces );
}

SnakeLeaderLogic.prototype.update = function(){


  for( var i = 0; i < this.leaders.length; i++ ){

    this.calculateForces( i , this.head , this.leaders[i] );

  }

  for( var i = 0; i < this.leaders.length; i++ ){

    var l = this.leaders[i];

    l.velocity.add( this.forces[i] );
    l.position.add( l.velocity );
    l.velocity.multiplyScalar( this.dampening );

  }

}

/*SnakeLeaderLogic.prototype.calculateForces = function( id , head ,  leader ){

  this.v1.copy( head.position );
  this.v1.sub( leader.position );

  this.v1.multiplyScalar( .0001 * (id + 1) );

  this.forces[ id  ].copy( this.v1 );

}*/


SnakeLeaderLogic.prototype.calculateForces = function( id , head ,  leader ){

  if( id == 0 ){
    this.v1.copy( head.position );
    this.v1.sub( leader.position );

    this.v1.normalize();
    this.v1.multiplyScalar( .03 );

    this.forces[ id  ].copy( this.v1 );
  }else{

    this.v1.copy( this.leaders[id-1].position );
    this.v1.sub( leader.position );

    this.v1.normalize();
    this.v1.multiplyScalar( .03 );

    this.forces[ id  ].copy( this.v1 );


  }

}
