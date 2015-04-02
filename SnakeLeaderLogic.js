function SnakeLeaderLogic(leaders){

  this.dampening = .99;

  this.leaders = leaders;
  this.forces = [];

  for( var i; i < this.leaders; i++ ){ 
    this.forces.push( new THREE.Vector3() );
  }

}

SnakeLeaderLogic.prototpe.update(){


  for( var i = 0; i < this.leaders.length; i++ ){

    this.forces[i].copy( this.calculateForces( this.leaders[i] ) );

  }

  for( var i = 0; i < this.leaders.length; i++ ){

    var l = this.leaders[i];
    l.position.add( l.velocity );
    l.velocity.multiplyScalar( this.dampening );

  }

}
