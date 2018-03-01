function Model5() {
	THREE.Object3D.call(this);

	this.myType = 'model';
	this.myId = 3;

	var scope = this;

	var geom;
	var material;
	var ball;
	var mixer;

	this.init = function(__complete) {
		var jsloader = new THREE.JSONLoader();
		jsloader.load("model/yuan.js", function(geometry, materials) {

			var mesh = new THREE.Mesh(geometry, materials);
			scope.add(mesh);
			mesh.scale.set(1, 1, 1);
			//mesh.position.set(0, 1, 0);

			/*console.log('+=========================');
			console.log(geometry);*/
			/*mixer = new THREE.AnimationMixer(mesh);
			mixer.clipAction(geometry.animations[0]).play();*/
		});

	}

	this.join = function() {

	}

	this.update = function(delta) {
		if(mixer) {
			mixer.update(delta);
		}
	}
}

Model5.constructor = Model5;
Model5.prototype = Object.create(THREE.Object3D.prototype);