var wid, hei;
var renderer;
var scene;
var camera;
var cameraBox;
var light;
var controls;
var clock, delta;
var color = chroma.scale(['white', 'blue', 'red', 'yellow', 'green']);
var num = 0;
var camera_dis = 40;
var canActive = true;

var modelArr = [{
		src: 'model/beijing.js',
		x: 0,
		y: -5,
		z: 0,
		rotationY: 0,
		cloud1: {
			x: -2,
			y: 8,
			z: 10,
			scale: 1
		},
		cloud2: {
			x: 4,
			y: 3,
			z: 5,
			scale: 1
		}
	},
	{
		src: 'model/chengdu.js',
		x: 20,
		y: 10,
		z: -30,
		rotationY: 0,
		cloud1: {
			x: -2,
			y: 6,
			z: 5,
			scale: 1
		},
		cloud2: {
			x: 4,
			y: 3,
			z: -5,
			scale: 1
		}
	},
	{
		src: 'model/qingdao.js',
		x: 50,
		y: 10,
		z: 0,
		rotationY: 0,
		cloud1: {
			x: -2,
			y: 6,
			z: 10,
			scale: 1
		},
		cloud2: {
			x: 7,
			y: 3,
			z: -10,
			scale: 1
		}
	},
	{
		src: 'model/tianjin.js',
		x: 30,
		y: -10,
		z: 20,
		rotationY: 0,
		cloud1: {
			x: -2,
			y: 6,
			z: 4,
			scale: 1
		},
		cloud2: {
			x: 6,
			y: 10,
			z: -4,
			scale: 1
		}
	}
];

var move = false;

$(function() {
	var vconsole = new VConsole();

	document.addEventListener('touchstart', function(event) {
		event.preventDefault();
	});

	clock = new THREE.Clock();
	delta = clock.getDelta();

	getSize(); //获取场景大小
	initThree(); //初始化Threejs
	initScene(); //初始化场景
	initCamera(); //初始化摄像机
	initControl(); //初始化控制器
	initLight(); //初始化灯光
	create_sky(); //创建天空
	create_cloud(); //创建云的模型
	create_man(); //加载外部模型

	initAction();
	render();
});

function getSize() {
	wid = window.innerWidth;
	hei = window.innerHeight;
}

function initThree() {
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
		preserveDrawingBuffer: true
	});
	//renderer.shadowMapEnabled = true;
	renderer.setSize(wid, hei);
	document.getElementById('canvas-frame').appendChild(renderer.domElement);
	renderer.setClearColor(0xcccccc, 1.0);
}

function initScene() {
	scene = new THREE.Scene();
}

function initCamera() {
	var sphere = new THREE.CubeGeometry(5, 5, 5);
	cameraBox = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
		color: 0x00ff00,
		transparent: true,
		opacity: 0
	}));

	cameraBox.position.set(0, 0, 0);
	scene.add(cameraBox);
	cameraBox.position.x = modelArr[0].x;
	cameraBox.position.y = modelArr[0].y;
	cameraBox.position.z = modelArr[0].z;

	camera = new THREE.PerspectiveCamera(45, wid / hei, 1, 20000);
	camera.position.set(0, 5, camera_dis);
	camera.position.x = modelArr[0].x;
	camera.position.y = modelArr[0].y + 5;
	camera.position.z = modelArr[0].z + camera_dis;

	camera.lookAt(cameraBox.position);

}

function initControl() {
	/*controls = new Controls(camera,cameraBox,renderer.domElement);
	controls.init();*/

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.autoRotate = false;
	controls.maxPolarAngle = 90 * Math.PI / 180;
	controls.enabled = false;
	controls.rotateSpeed = 0.3;
	controls.target = cameraBox.position;
}

function initLight() {
	//环境光
	light = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(light);

	var dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
	dirLight.position.set(10, 30, 20);
	//dirLight.castShadow = true;
	scene.add(dirLight);

	var helper = new THREE.DirectionalLightHelper(dirLight);
	scene.add(helper);
}

//创建天空盒的三个方法
function create_sky() {
	var materials = [
		loadTexture('model/px.jpg'), // right
		loadTexture('model/nx.jpg'), // left
		loadTexture('model/py.jpg'), // top
		loadTexture('model/ny.jpg'), // bottom
		loadTexture('model/pz.jpg'), // back
		loadTexture('model/nz.jpg') // front
	];
	var skyMaterial = new THREE.MeshFaceMaterial(materials);
	var skyGeometry = new THREE.CubeGeometry(1000, 1000, 1000);
	var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
	scene.add(skyBox);

	/*var textureCube = new THREE.CubeTextureLoader()
		.setPath('model/')
		.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],function(){
			scene.background = textureCube;
		});*/

	/*var skyboxGeometry = new THREE.SphereGeometry(300, 20, 20);
	var map = new THREE.TextureLoader().load("model/sky2.jpg");
	map.wrapT = THREE.RepeatWrapping;
	var skyboxMaterial = new THREE.MeshBasicMaterial({
		map: map,
		side: THREE.BackSide
	});
	var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
	scene.add(skybox);*/

}

function loadTexture(path) {
	var material = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture(path),
		side: THREE.BackSide
	})
	return material;
}

var cloud_geo, cloud_material;

function create_cloud() {
	var loader = new THREE.JSONLoader();
	loader.load('model/cloud1.json', function(geo, materials) {
		cloud_geo = geo;
		cloud_material = new THREE.MeshPhongMaterial({
			color: 0xffffff
		});
		create_man();
	});
}

function create_man() {
	for(let i = 0; i < modelArr.length; i++) {
		var jsloader = new THREE.JSONLoader();
		let temp = modelArr[i];
		var src = temp.src;
		jsloader.load(src, function(geometry, materials) {
			var a = new THREE.MeshPhongMaterial({
				color: color(Math.random()).hex()
			});

			var mesh = new THREE.Mesh(geometry, a);
			scene.add(mesh);
			mesh.myId = i;

			mesh.position.set(temp.x, temp.y, temp.z);
			mesh.rotation.y = temp.rotationY * Math.PI / 180;
			mesh.type = 'main';

			var cloud1 = new THREE.Mesh(cloud_geo, cloud_material);
			mesh.add(cloud1);
			cloud1.scale.set(temp.cloud1.scale, temp.cloud1.scale, temp.cloud1.scale);
			cloud1.position.x = temp.cloud1.x;
			cloud1.position.y = temp.cloud1.y;
			cloud1.position.z = temp.cloud1.z;

			var cloud2 = new THREE.Mesh(cloud_geo, cloud_material);
			mesh.add(cloud2);
			cloud2.scale.set(temp.cloud2.scale, temp.cloud2.scale, temp.cloud2.scale);
			cloud2.position.x = temp.cloud2.x;
			cloud2.position.y = temp.cloud2.y;
			cloud2.position.z = temp.cloud2.z;
		});
	}
}

var preX;
var preY;
var currX, currY;
var isClick = false;
var mouse = new THREE.Vector3();
var raycaster = new THREE.Raycaster();
var isMove = false;

function initAction() {
	$('body').on('touchstart', startHandler);
}

function startHandler(e) {
	if(!canActive) return;
	e.preventDefault();
	var touch = e.originalEvent.targetTouches[0];
	preX = touch.pageX;
	preY = touch.pageY;

	//做点击对象效果的部分
	isClick = true;
	currX = touch.pageX;
	currY = touch.pageY;
	setTimeout(function() {
		isClick = false;
	}, 200);

	$('body').on('touchmove', moveHandler);
	$('body').on('touchend', endHandler);
}

var camera_targetX = modelArr[0].x,
	camera_targetY = modelArr[0].y + 5;

function moveHandler(e) {
	var touch = e.originalEvent.targetTouches[0];
	var __x = (touch.pageX - preX) * 0.05;
	camera_targetX = camera.position.x + __x;
	//camera.position.x += __x;

	var __y = (touch.pageY - preY) * 0.05;
	camera_targetY = camera.position.y + __y;
	//camera.position.y += __y;

	setTimeout(function() {
		preX = touch.pageX;
		preY = touch.pageY;
	}, 200);

}

function endHandler() {
	$('body').off('touchmove', moveHandler);
	$('body').off('touchend', endHandler);

	//点击对象的部分
	if(isClick == true) {
		$('#icon').hide();
		//将屏幕像素坐标转化成camare坐标
		mouse.x = (currX / renderer.domElement.clientWidth) * 2 - 1;
		mouse.y = -(currY / renderer.domElement.clientHeight) * 2 + 1;

		//设置射线的起点是相机
		raycaster.setFromCamera(mouse, camera);

		var intersects = raycaster.intersectObjects(scene.children, true);
		if(intersects.length > 0) {
			var currObj = intersects[0].object;
			if(currObj.type == 'main') {
				//console.log(currObj.myId);
				canActive = false;
				isMove = true;
				TweenMax.to(camera.position, 1, {
					z: camera.position.z - 10,
					onComplete: function() {
						controls.target = cameraBox.position;
						controls.enabled = true;
					}
				});

				backIn();
			}
		}
	} else {
		canActive = false;
		boxMove();
	}
}

function boxMove() {
	isMove = true;
	var pre = modelArr[num];

	num++;
	if(num >= modelArr.length) {
		num = 0;
	}

	var next = modelArr[num];
	camera_targetX = next.x;
	camera_targetY = next.y + 5;

	var cc = 30 - Math.random() * 60;

	TweenMax.to(cameraBox.position, 2.5, {
		x: next.x,
		y: next.y,
		z: next.z,
		ease: Quart.easeInOut
	});

	TweenMax.to(camera.position, 2.5, {
		bezier: [{
			x: next.x,
			y: next.y + 5,
			z: next.z + camera_dis - 10
		}, {
			x: next.x,
			y: next.y + 5,
			z: next.z + camera_dis
		}],
		ease: Quart.easeInOut,
		onComplete: function() {
			isMove = false;
			canActive = true;
		}
	});
}

function cameraRest() {
	var temp = modelArr[num];
	TweenMax.to(camera.position, 1, {
		x: temp.x,
		y: temp.y + 5,
		z: temp.z + camera_dis,
		onComplete: function() {
			canActive = true;
			isMove = false;
			console.log(camera.position);
		}
	});

	controls.enabled = false;
}

function render() {
	if(controls) {
		controls.update(delta);
	}

	camera.lookAt(cameraBox.position);

	if(!isMove) {
		camera.position.x += (camera_targetX - camera.position.x) * 0.05;
		camera.position.y += (camera_targetY - camera.position.y) * 0.05;
	}

	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

$('#back').on('click', function() {
	backOut();
	cameraRest();
});

function backIn() {
	if($('#back').hasClass('back_out')) {
		$('#back').removeClass('back_out');
	}
	$('#back').addClass('back_in');
}

function backOut() {
	if($('#back').hasClass('back_in')) {
		$('#back').removeClass('back_in');
	}
	$('#back').addClass('back_out');
}