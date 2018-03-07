function Model1() {
	THREE.Object3D.call(this);

	this.myType = 'model';
	this.myId = 0;

	var scope = this;
	var mixer;
	var mesh;
	var angle = 0;
	var angleY = 0;

	this.init = function(__complete) {
		var loader = new THREE.TextureLoader();
		var texture = loader.load('model/land/a/textures/textureSurface_Color_2.jpg');
		var texture_ao = loader.load('model/land/a/textures/textureAmbient_Occlusion.jpg');

		var jsloader = new THREE.JSONLoader();
		jsloader.load("model/land/a/aland.json", function(geometry, materials) {
			var a = new THREE.MeshPhongMaterial({
				map: texture
			});

			mesh = new THREE.Mesh(geometry, a);
			scope.add(mesh);
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

			//创建小动物，蒙皮动画
			var loader2 = new THREE.TextureLoader();
			var texture2 = loader2.load('model/land/a1/textures/texture.png');

			var jsloader = new THREE.JSONLoader();
			jsloader.load("model/land/a1/animations.json", function(geometry, materials) {
				var b = new THREE.MeshPhongMaterial({
					map: texture2,
					flatShading: true,
					morphTargets: true, //是否变形目标
					morphNormals: true, //是否用了法线变形
					specular: 0,
					shininess: 0,
					skinning: true //是否使用蒙皮
				});

				var animate = new THREE.SkinnedMesh(geometry, b);
				mesh.add(animate);
				animate.scale.multiplyScalar(0.1);
				animate.position.z = 30;
				animate.position.y = 5;

				mixer = new THREE.AnimationMixer(animate);
				mixer.clipAction(geometry.animations[0]).play();
			});

			if(__complete) __complete();
		});
	}

	this.join = function() {

	}

	this.update = function(delta) {
		if(mixer) {
			mixer.update(delta);
		}

		if(mesh) {
			angle += 0.05 * Math.PI / 180;
			mesh.rotation.y = angle;

			angleY += 1 * Math.PI / 180;
			mesh.position.y = Math.sin(angleY) * .5 + 0.5;
		}
	}
}

Model1.constructor = Model1;
Model1.prototype = Object.create(THREE.Object3D.prototype);