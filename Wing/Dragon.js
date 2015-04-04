function Dragon(){

  this.body = new THREE.Object3D();
  
  this.spine = new Spine();

  this.leftWing = new Wing( this.spine , true , {
   
    vertexShader: shaders.vs.wing,
    fragmentShader: shaders.fs.wing,
    simulationShader: shaders.ss.wing,
   
  });

  this.rightWing = new Wing( this.spine , false , {
   
    vertexShader: shaders.vs.wing,
    fragmentShader: shaders.fs.wing,
    simulationShader: shaders.ss.wing,
   
  });


  this.body.add( this.leftWing.body );
  this.body.add( this.rightWing.body );
  this.body.add( this.spine.body );


}

Dragon.prototype.update = function( size , time ){

  this.leftWing.update( size , time );
  this.rightWing.update( size , time );
  this.spine.update( size , time );

}


