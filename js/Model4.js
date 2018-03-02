function Model4() {
	THREE.Object3D.call(this);

	this.myType = 'model';
	this.myId = 3;

	var scope = this;

	var geom;
	var material;
	var ball;
	var mixer;
	var mesh;

	this.init = function(__complete) {
		material = new THREE.MeshStandardMaterial({
			color: new THREE.Color().setHSL(Math.random(), 1, 0.75),
			/*roughness: 1.8,
			metalness: 0,*/
			flatShading: true
		});

		geom = new THREE.SphereGeometry(6, 10, 10);

		ball = new THREE.Mesh(geom, material);
		scope.add(ball);
		ball.position.y = -5;

		var loader = new THREE.TextureLoader();
		var texture = loader.load('model/color.jpg');

		var jsloader = new THREE.JSONLoader();
		jsloader.load("model/person.json", function(geometry, materials) {
			var a = new THREE.MeshPhongMaterial({
				map: texture,
				flatShading: true,
				morphTargets: true, //是否变形目标
				morphNormals: true, //是否用了法线变形
				specular: 0,
				shininess: 0, //光亮
				skinning: true //是否使用蒙皮
			});

			mesh = new THREE.SkinnedMesh(geometry, a);
			scope.add(mesh);
			mesh.scale.set(1, 1, 1);
			mesh.position.set(0, 1, 0);

			mixer = new THREE.AnimationMixer(mesh);
			mixer.clipAction(geometry.animations[0]).play();

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

	this.update = function(delta) {
		if(mixer) {
			mixer.update(delta);
		}
		if(ball) {
			ball.rotation.x -= 0.5 * Math.PI / 180;
		}
	}
}

Model4.constructor = Model4;
Model4.prototype = Object.create(THREE.Object3D.prototype);