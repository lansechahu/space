/*云的类，在这里创建一个云*/

function Clouds() {
	THREE.Object3D.call(this);

	this.myType = 'cloud';

	var scope = this;
	var cloud_geo, cloud_material;
	var cloud;
	var speed = 0;
	var speedNum = 0;
	var speedSub = 0;
	var dir = 1;
	var angle = 0;

	this.init = function() {
		speed = Math.random() * 0.005 + 0.005;
		speedNum = speed;
		speedSub = speed * 0.002;
		var loader = new THREE.JSONLoader();
		loader.load('model/cloud1.json', function(geo, materials) {
			cloud_geo = geo;
			cloud_material = new THREE.MeshPhongMaterial({
				color: 0xffffff
			});

			scope.join();
		});
	}

	this.join = function() {
		cloud = new THREE.Mesh(cloud_geo, cloud_material);
		scope.add(cloud);
	}

	this.update = function() {
		if(cloud) {
			angle+=speed;
			var aa = Math.sin(angle)*0.005;
			cloud.position.x += aa;
		}
	}
}

Clouds.constructor = Clouds;
Clouds.prototype = Object.create(THREE.Object3D.prototype);