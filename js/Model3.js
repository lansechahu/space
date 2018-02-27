function Model3() {
	THREE.Object3D.call(this);

	this.myType = 'model';
	this.myId = 2;

	var scope = this;

	this.init = function(__complete) {
		loader = new THREE.SEA3D({
			autoPlay: true, // Auto play animations
			container: scope // Container to add models
		});

		loader.onComplete = function(e) {
			console.log(e);

			var aa = loader.getMesh('Mascot'); //获取模型里的模型主体mesh
			console.log(aa);
			aa.scale.multiplyScalar(0.015);
			aa.position.x = 0;
			aa.position.y = 0;
			aa.position.z = 0;

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
		};

		loader.load('model/mascot.tjs.sea');
	}

	this.join = function() {

	}

	this.update = function(delta) {
		THREE.SEA3D.AnimationHandler.update(delta);
	}
}

Model3.constructor = Model3;
Model3.prototype = Object.create(THREE.Object3D.prototype);