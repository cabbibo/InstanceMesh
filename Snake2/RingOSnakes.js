function RingOSnakes( leaders , params ){

  this.snakes = [];  
  for( var i = 0; i < leaders.length; i ++ ){

    var su = {
      leader:{ type:"v3" , value: leaders[i].position },
    }

    for( var propt in params.soulUniforms ){
      if( propt !== 'leader' ){
        su[ propt ] = params.soulUniforms[ propt ];
      }
    }
    
    var bu = {
      leader:{ type:"v3" , value: leaders[i].position },
    }

    for( var propt in params.bodyUniforms ){
      if( propt !== 'leader' ){
        bu[ propt ] = params.bodyUniforms[ propt ];
      }
    }

    
    snake = new Snake( {

      soulUniforms:       su,
      
      instanceNumber:     32 * 32, 

      renderer:           params.renderer,
     
      vs: params.vs,
      fs: params.fs,
      geos: params.geos,
      uniforms: params.uniforms,
      
     
      simulationShader:   params.simulationShader,


    });

    this.snakes.push( snake );

  }

}

RingOSnakes.prototype.activate = function( scene ){

  for( var i = 0; i < this.snakes.length; i++ ){
    this.snakes[i].activate( scene ); //scene.add( this.snakes[i].body );
  }

}

RingOSnakes.prototype.deactivate = function( scene ){

  for( var i = 0; i < this.snakes.length; i++ ){
    this.snakes[i].deactivate( scene ); //scene.add( this.snakes[i].body );
  }

}


RingOSnakes.prototype.update = function(){

  for( var i = 0; i < this.snakes.length; i++ ){
    this.snakes[i].update();
  }
}

RingOSnakes.prototype.checkParams = function( params ){

  if( !params.geometry          ){ console.log( 'no geometry provided'        ); } 
  if( !params.renderer          ){ console.log( 'no renderer provided'        ); } 
  if( !params.vertexShader      ){ console.log( 'no vert shader provided'     ); } 
  if( !params.fragmentShader    ){ console.log( 'no frag shader provided'     ); } 
  if( !params.simulationShader  ){ console.log( 'no sim shader provided'      ); } 
  if( !params.bodyUniforms      ){ console.log( 'no bodyUniforms provided'    ); } 
  if( !params.soulUniforms      ){ console.log( 'no soulUniforms provided'    ); } 

}
