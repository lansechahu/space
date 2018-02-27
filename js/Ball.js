/*提示圆点的类*/
function Ball() {
	THREE.Object3D.call(this);

	this.myType = 'ball';

	var scope = this;
	var circleRadius = 5;
	var color = 0x00ecb7;

	var geometry;
	var circleShape;
	var meshArr = [];
	var len = 3;

	this.init = function() {
		circleShape = new THREE.Shape();
		circleShape.absarc(0, 0, 1, 0, Math.PI * 2, false);
		geometry = new THREE.ShapeGeometry(circleShape);

		scope.join();
	}

	this.join = function() {
		var scale = [0.3, 0.6, 0.9];
		for(var i = 0; i < len; i++) {
			var material = new THREE.MeshBasicMaterial({
				transparent: true,
				color: color
			});
			var mesh = new THREE.Mesh(geometry, material);
			scope.add(mesh);
			mesh.position.set(0, 0, 0.1 * (len - i));
			mesh.scale.set(scale[i], scale[i], scale[i]);
			mesh.material.opacity = 1 - scale[i];
			meshArr.push(mesh);
		}
	}

	this.update = function() {
		for(var i = 0; i < meshArr.length; i++) {
			var temp = meshArr[i];
			var scale = temp.scale.x + 0.005;
			if(scale > 1) scale = 0;
			temp.scale.set(scale, scale, scale);
			temp.material.opacity = 1 - scale;
		}
	}
}

Ball.constructor = Ball;
Ball.prototype = Object.create(THREE.Object3D.prototype);