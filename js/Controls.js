//控制器，通过指针划动，让一个东东绕着一个目标转

var Controls = function(__camera, __target) {
	this.speed = 1; //移动速度
	this.target = __target; //绕着谁转，这是一个THREE.Vector3对象
	this.enabled = true; //是否启用
	this.panY = 0; //Y轴的偏移量，让镜头不是正对着对象

	var scope = this;
	var camera = __camera;
	var radius = Math.abs(camera.position.z - this.target.z); //移动半径，为目标到摄像机的距离
	var angle = 0;
	var angleY = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var mouseX = 0;
	var mouseY = 0;
	var mouseXOnMouseDown = 0;
	var mouseYOnMouseDown = 0;
	var targetX = 0;
	var targetY = 0;
	var targetXOnMouseDown = 0;
	var targetYOnMouseDown = 0;

	this.init = function() {
		document.addEventListener('touchstart', onMouseDown, false);
	}

	this.setTarget = function(__target) {
		scope.target = __target;
		radius = 20; //Math.abs(camera.position.z - scope.target.z);
		targetX = 45;
	}

	function onMouseDown(event) {
		event.preventDefault();
		if(!scope.enabled) return;
		mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
		targetXOnMouseDown = targetX;

		mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
		targetYOnMouseDown = targetY;

		document.addEventListener('touchmove', onMouseMove, false);
		document.addEventListener('touchend', onMouseUp, false);
	}

	function onMouseMove(event) {
		event.preventDefault();
		if(!scope.enabled) return;

		mouseX = event.touches[0].pageX - windowHalfX;
		targetX = targetXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.08;

		mouseY = event.touches[0].pageY - windowHalfY;
		targetY = targetYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.08;
	}

	function onMouseUp() {
		document.removeEventListener('touchmove', onMouseMove, false);
		document.removeEventListener('touchend', onMouseUp, false);
	}

	this.update = function(__delta) {
		if(!scope.enabled) {
			angle = 0;
			angleY = 0;
			mouseX = 0;
			mouseY = 0;
			mouseXOnMouseDown = 0;
			mouseYOnMouseDown = 0;
			targetX = 0;
			targetY = 0;
			targetXOnMouseDown = 0;
			targetYOnMouseDown = 0;
			return;
		}

		angle = targetX * Math.PI / 180;
		angleY = targetY * Math.PI / 180;
		var __x = scope.target.x + Math.sin(angle) * radius;
		var __y = scope.target.y + Math.sin(angleY) * radius + panY;
		var __z = scope.target.z + Math.cos(angle) * radius;

		camera.position.x += (__x - camera.position.x) * 0.05;
		camera.position.y += (__y - camera.position.y) * 0.05;
		camera.position.z += (__z - camera.position.z) * 0.05;
	}
};