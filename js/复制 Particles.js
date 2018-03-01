/*粒子类*/
function Particles() {
	THREE.Object3D.call(this);

	this.myType = 'particle';

	var scope = this;

	var geom;
	var material;
	var texture;
	var system;

	this.init = function() {
		texture = THREE.ImageUtils.loadTexture("model/particle1.jpg");
		geom = new THREE.Geometry();
		material = new THREE.ParticleBasicMaterial({
			size: 2,
			transparent: true,
			opacity: 0.3,
			map: texture,
			blending: THREE.AdditiveBlending,
			sizeAttenuation: true,
			fog:true
		});

		scope.join();
	}

	this.join = function() {
		for(var i = 0; i < 300; i++) {
			var __x = 100 - Math.random() * 200;
			var __y = 100 - Math.random() * 200;
			var __z = 100 - Math.random() * 200;

			var temp = new THREE.Vector3(__x, __y, __z);
			temp.angle = Math.floor(Math.random() * 360);
			temp.angleSpeed = 0.002 + Math.random() * 1 * 0.003;
			temp.radius = Math.random() * 10 + 30;
			temp.__x_dir = getDir();
			temp.__y_dir = getDir();
			temp.__z_dir = getDir();

			temp.initX = __x;
			temp.initY = __y;
			temp.initZ = __z;
			
			temp.x = temp.__x_dir * Math.cos(temp.angle) * temp.radius + temp.initX;
			temp.y = temp.__y_dir * Math.sin(temp.angle) * temp.radius + temp.initY;
			temp.z = temp.__z_dir * Math.sin(temp.angle) * temp.radius + temp.initZ;
			
			geom.vertices.push(temp);
			geom.colors.push(new THREE.Color(Math.random() * 0x00ffff));
		}

		system = new THREE.ParticleSystem(geom, material);
		system.sortParticles = true;
		scope.add(system);
	}

	this.aa = function() {
		var vertices = system.geometry.vertices;
		vertices.forEach(function(v) {
			v.x = 0;
			v.y = 0;
			v.z = 0;
		});
		geom.verticesNeedUpdate = true; //需要更新几何体
	}

	function getDir() {
		var aa = Math.floor(Math.random() * 2);
		var __dir = 0;
		if(aa == 0) {
			__dir = -1;
		} else {
			__dir = 1;
		}
		return __dir;
	}

	this.update = function() {
		var vertices = system.geometry.vertices;
		vertices.forEach(function(v) {
			v.angle += v.angleSpeed;
			v.x = v.__x_dir * Math.cos(v.angle) * v.radius + v.initX;
			v.y = v.__y_dir * Math.sin(v.angle) * v.radius + v.initY;
			v.z = v.__z_dir * Math.sin(v.angle) * v.radius + v.initZ;
		});
		geom.verticesNeedUpdate = true; //需要更新几何体
	}
}

Particles.constructor = Particles;
Particles.prototype = Object.create(THREE.Object3D.prototype);