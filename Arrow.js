function Feather(){

  var geometry = new THREE.Geometry();

  var cyl = new THREE.CylinderGeometry( 1 , 1 , 1 , 3  );
  var geo = new THREE.Mesh( cyl )

  geo.scale.y = 1
  geo.scale.x = .02
  geo.scale.z = .02

  geo.scale.multiplyScalar( .2 )

  geo.updateMatrix();
  geometry.merge ( geo.geometry , geo.matrix )


  var height = .1;
  var numOf = 10;

  var cyl = new THREE.CylinderGeometry( 1 , 1 , 1 , 3  );
  var geo = new THREE.Mesh( cyl )
  for( var i = 0; i < numOf; i ++ ){

    for( var  j = 0; j < 2; j ++ ){
      
      geo.scale.y = .5
      geo.scale.x = .02
      geo.scale.z = .02

      geo.scale.multiplyScalar( .05 )

      geo.rotation.z = ((j-.5 )*2) * Math.PI / 3;
      geo.position.y = (-1. + (i/ (numOf * 2) ))* height
      geo.position.x = ((j-.5 )*2) * .01;

      geo.updateMatrix();
      geometry.merge ( geo.geometry , geo.matrix )

    }

  }

  var cyl = new THREE.CylinderGeometry( 0 , 1 , 1 , 8  );
  var geo = new THREE.Mesh( cyl )
  
  geo.scale.y = .3
  geo.scale.x = .06
  geo.scale.z = .06

  geo.scale.multiplyScalar( .2 )
  geo.position.y = .1;

  geo.updateMatrix();
  geometry.merge ( geo.geometry , geo.matrix )



  geometry.computeFaceNormals();
  return geometry;

}
