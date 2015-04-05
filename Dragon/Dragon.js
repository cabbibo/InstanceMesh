/*

   TODO:

   vertex shader for spine is not using the right rotation

   Same true for arm, could be reason wing bunching up by end of spine
   probably in getBonePosition

*/
function Dragon(){

  this.body = new THREE.Object3D();
  
  this.spine = new Spine({
    
    vs:{
      spine: shaders.vs.spine,
      scales: shaders.vs.scale,
    
    },
    
    fs:{
      spine: shaders.fs.spine,
      scales: shaders.fs.scale,
    },

    numBones: 16,

    spineSlices: 45,
    spineSides: 8, 
    
    scaleSides: 10,
    scaleSlices: 200,

  });

  this.leftWing = new Wing( this.spine , true , {
   
    vs:{
      wing:shaders.vs.wing,
      arm:shaders.vs.arm,
    },
    fs:{
      wing:shaders.fs.wing,
      arm:shaders.fs.arm,
    },

    ss:{
      wing:shaders.ss.wing,
    },
    numBones: 16,
    wingSpan: 10,

    armSlices: 35,
    armSides: 8

  });

  this.rightWing = new Wing( this.spine , false , {
   
    vs:{
      wing:shaders.vs.wing,
      arm:shaders.vs.arm,
    },
    fs:{
      wing:shaders.fs.wing,
      arm:shaders.fs.arm,
    },

    ss:{
      wing:shaders.ss.wing,
    },
    
    numBones: 16,
    wingSpan: 10,

    armSlices: 35,
    armSides: 8

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


