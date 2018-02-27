function Model1() {
	THREE.Object3D.call(this);

	this.myType = 'model';
	this.myId = 0;

	var scope = this;

	this.init = function(__complete) {
		var loader = new THREE.PLYLoader();
		loader.load('model/dolphins.ply', function(geometry) {

			//geometry.computeVertexNormals();

			var material = new THREE.MeshStandardMaterial({
				color: 0x0055ff,
				flatShading: true
			});
			var mesh = new THREE.Mesh(geometry, material);

			mesh.rotation.x = -Math.PI / 2;
			mesh.scale.multiplyScalar(0.015);

			scope.add(mesh);

			//创建该模型上的云
			var cloud1 = new Clouds();
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
			cloud2.position.z = modelArr[scope.myId].cloud2.z;

			if(__complete) __complete();
		});
	}

	this.join = function() {

	}

	this.update = function() {

	}
}

Model1.constructor = Model1;
Model1.prototype = Object.create(THREE.Object3D.prototype);