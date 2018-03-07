function Model2() {
	THREE.Object3D.call(this);

	this.myType = 'model';
	this.myId = 1;

	var scope = this;
	var mesh;
	var angleY = 0;

	this.init = function(__complete) {
		var loader = new THREE.TextureLoader();
		var texture = loader.load('model/land/b/textures/sketchfabSurface_Color.jpg');

		var jsloader = new THREE.JSONLoader();
		jsloader.load("model/land/b/bLand.json", function(geometry, materials) {
			var a = new THREE.MeshBasicMaterial({
				map: texture
			});

			mesh = new THREE.Mesh(geometry, a);
			scope.add(mesh);
			mesh.position.set(2, -5, 8);
			mesh.scale.multiplyScalar(0.05);

			//创建该模型上的云
			/*var cloud1 = new Clouds();
			cloud1.init();
			scope.add(cloud1);
			cloud1.scale.set(modelArr[scope.myId].cloud1.scale, modelArr[scope.myId].cloud1.scale, modelArr[scope.myId].cloud1.scale);
			cloud1.position.x = modelArr[scope.myId].cloud1.x;
			cloud1.position.y = modelArr[scope.myId].cloud1.y;
			cloud1.position.z = modelArr[scope.myId].cloud1.z;

			var cloud2 = new Clouds();
			cloud2.init();
			scope.add(cloud2);
			cloud2.scale.set(modelArr[scope.myId].cloud2.scale, modelArr[scope.myId].cloud2.scale, modelArr[scope.myId].cloud2.scale);
			cloud2.position.x = modelArr[scope.myId].cloud2.x;
			cloud2.position.y = modelArr[scope.myId].cloud2.y;
			cloud2.position.z = modelArr[scope.myId].cloud2.z;*/

			if(__complete) __complete();
		});
	}

	this.join = function() {

	}

	this.update = function() {
		if(mesh) {
			angleY += 1 * Math.PI / 180;
			mesh.position.y = Math.cos(angleY) * .5 + 0.5 - 5;
		}
	}
}

Model2.constructor = Model2;
Model2.prototype = Object.create(THREE.Object3D.prototype);