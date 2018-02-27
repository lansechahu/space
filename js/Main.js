var wid, hei; //场景宽高
var renderer; //渲染器
var scene; //场景
var camera; //摄像机
var cameraBox; //摄像机的香肠
var light; //环境光
var controls; //控制器
var clock, delta;
var color = chroma.scale(['white', 'blue', 'red', 'yellow', 'green']);
var num = 0; //轮流观看模型的计数器
var camera_dis = 40; //摄像机距目标的z轴距离
var canActive = true; //大场景拖动判定，为false时是不能拖动
var meshArr = []; //模型数组
var ballArr = []; //提示点数组
var isBegin = false; //模型是否已经载入

var cloudBox; //大片云的容器
var cloudNum = 20; //大片云的数量

var panY = 10; //Y轴的偏移量，让镜头不是正对着对象

var particle; //粒子

//模型信息数组
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
		src: 'model/wuhan.js',
		x: 30,
		y: -10,
		z: 20,
		rotationY: 0,
		cloud1: {
			x: -2,
			y: 4,
			z: 4,
			scale: 1
		},
		cloud2: {
			x: 6,
			y: 8,
			z: -4,
			scale: 1
		}
	}
];

$(function() {
	var vconsole = new VConsole();

	document.addEventListener('touchstart', function(event) {
		event.preventDefault();
	});

	clock = new THREE.Clock();
	delta = clock.getDelta();

	//设置一开始时摄像机的目标位置，为摄像机对着第一个模型的位置
	targetX = modelArr[num].x;
	targetY = modelArr[num].y + panY;

	getSize(); //获取场景大小
	initThree(); //初始化Threejs
	initScene(); //初始化场景
	initCamera(); //初始化摄像机
	initControl(); //初始化控制器
	initLight(); //初始化灯光
	create_sky(); //创建天空
	create_man(); //加载外部模型
	join_clouds(); //创建所有的云
	create_ball(); //创建点击提示球
	create_particle(); //创建粒子

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

	//创建摄像机香肠
	var sphere = new THREE.CubeGeometry(5, 5, 5);
	cameraBox = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
		color: 0x00ff00,
		transparent: true,
		opacity: 0
	}));

	//设置摄像机香肠的位置，为第一个模型的位置
	cameraBox.position.set(0, 0, 0);
	scene.add(cameraBox);
	cameraBox.position.x = modelArr[0].x;
	cameraBox.position.y = modelArr[0].y;
	cameraBox.position.z = modelArr[0].z;

	//创建摄像机
	camera = new THREE.PerspectiveCamera(45, wid / hei, 1, 20000);
	camera.position.set(0, 5, camera_dis);
	camera.position.x = modelArr[0].x - 100;
	camera.position.y = modelArr[0].y + 150;
	camera.position.z = modelArr[0].z + camera_dis;

	//让摄像机看向香肠
	camera.lookAt(cameraBox.position);

}

//初始化控制器，这个控制器是点击模型后控制摄像机转的，围着该模型转
function initControl() {
	controls = new Controls(camera, cameraBox.position);
	controls.enabled = false; //enabled设为false，这个控制器就不起作用
	controls.init();
}

function initLight() {
	//环境光
	light = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(light);

	//方向光
	var dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
	dirLight.position.set(10, 30, 20);
	//dirLight.castShadow = true;
	scene.add(dirLight);

	/*var helper = new THREE.DirectionalLightHelper(dirLight);
	scene.add(helper);*/
}

//创建天空盒的三个方法
var skyBox; //天空盒
function create_sky() {
	//方法一
	var materials = [
		loadTexture('model/px.jpg'), // right
		loadTexture('model/nx.jpg'), // left
		loadTexture('model/py.jpg'), // top
		loadTexture('model/ny.jpg'), // bottom
		loadTexture('model/pz.jpg'), // back
		loadTexture('model/nz.jpg') // front
	];
	var skyMaterial = new THREE.MeshFaceMaterial(materials);
	var skyGeometry = new THREE.CubeGeometry(500, 500, 500);
	skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
	scene.add(skyBox);

	//方法二
	/*var textureCube = new THREE.CubeTextureLoader()
		.setPath('model/')
		.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],function(){
			scene.background = textureCube;
		});*/

	//方法三
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

//载入天空盒的贴图
function loadTexture(path) {
	var material = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture(path),
		side: THREE.BackSide
	})
	return material;
}

//创建模型
function create_man() {
	var __num = 0;
	for(let i = 0; i < modelArr.length; i++) {
		var jsloader = new THREE.JSONLoader();
		let temp = modelArr[i];
		var src = temp.src;
		jsloader.load(src, function(geometry, materials) {
			//创建模型的材质，随便给它个颜色
			var a = new THREE.MeshPhongMaterial({
				color: color(Math.random()).hex()
			});

			//创建模型mesh
			var mesh = new THREE.Mesh(geometry, a);
			scene.add(mesh);
			mesh.myId = i;

			//设置模型的位置和初始旋转角度
			mesh.position.set(temp.x, temp.y, temp.z);
			mesh.rotation.y = temp.rotationY * Math.PI / 180;
			mesh.myType = 'main'; //设置类型为main
			meshArr.push(mesh);

			//创建该模型上的云
			var cloud1 = new Clouds();
			cloud1.init();
			mesh.add(cloud1);
			cloud1.scale.set(temp.cloud1.scale, temp.cloud1.scale, temp.cloud1.scale);
			cloud1.position.x = temp.cloud1.x;
			cloud1.position.y = temp.cloud1.y;
			cloud1.position.z = temp.cloud1.z;

			var cloud2 = new Clouds();
			cloud2.init();
			mesh.add(cloud2);
			cloud2.scale.set(temp.cloud2.scale, temp.cloud2.scale, temp.cloud2.scale);
			cloud2.position.x = temp.cloud2.x;
			cloud2.position.y = temp.cloud2.y;
			cloud2.position.z = temp.cloud2.z;

			__num++;

			if(__num >= modelArr.length) {
				isBegin = true;
			}
		});
	}
}

//创建点击提示球
function create_ball() {
	for(var i = 0; i < 4; i++) {
		var ball = new Ball();
		ball.init();
		scene.add(ball);
		ball.position.set(modelArr[i].x - 4, modelArr[i].y + 2, modelArr[i].z + 3);
		ballArr.push(ball);
	}
}

//创建所有的云
function join_clouds() {
	cloudBox = new THREE.Object3D();
	scene.add(cloudBox);

	for(var i = 0; i < cloudNum; i++) {
		var temp = new Clouds();
		temp.init();
		scene.add(temp);
		var scale = Math.random() * 2 + 1;
		var __x = 50 - Math.random() * 200;
		var __y = 50 - Math.random() * 200;
		var __z = 50 - Math.random() * 200;
		temp.scale.set(scale, scale, scale);
		temp.position.set(__x, __y, __z);
	}
}

//创建粒子
function create_particle() {
	particle = new Particles();
	particle.init();
	scene.add(particle);
}

//外层拖动变量
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

//点击判定部分的变量
var startX, startY;
var currX, currY;
var mouse = new THREE.Vector3();
var raycaster = new THREE.Raycaster();
var isMove = false; //摄像头是否正在移动，如果为true，则场景拖动无效

function initAction() {
	$('body').on('touchstart', startHandler);
}

function startHandler(e) {
	if(!canActive) return;
	e.preventDefault();
	var touch = e.originalEvent.targetTouches[0];
	mouseXOnMouseDown = touch.pageX - windowHalfX;
	targetXOnMouseDown = targetX;

	mouseYOnMouseDown = touch.pageY - windowHalfY;
	targetYOnMouseDown = targetY;

	//做点击对象效果的部分
	currX = touch.pageX;
	currY = touch.pageY;
	startX = currX;
	startY = currY;

	$('body').on('touchmove', moveHandler);
	$('body').on('touchend', endHandler);
}

var camera_targetX = modelArr[0].x,
	camera_targetY = modelArr[0].y + panY;

function moveHandler(e) {
	var touch = e.originalEvent.targetTouches[0];
	currX = touch.pageX;
	currY = touch.pageY;

	mouseX = touch.pageX - windowHalfX;
	targetX = targetXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;

	mouseY = touch.pageY - windowHalfY;
	targetY = targetYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.05;
}

function endHandler() {
	$('body').off('touchmove', moveHandler);
	$('body').off('touchend', endHandler);

	//点击对象的部分
	$('#icon').hide();
	//将屏幕像素坐标转化成camare坐标
	mouse.x = (currX / renderer.domElement.clientWidth) * 2 - 1;
	mouse.y = -(currY / renderer.domElement.clientHeight) * 2 + 1;

	//设置射线的起点是相机
	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(scene.children, true);
	if(intersects.length > 0) {
		var currObj = intersects[0].object;
		
		//如果鼠标移动的距离大于50，则摄像机移到下一个模型上,否则如果点击到的对象类型是main，则说明点击到模型了
		if(Math.abs(currX - startX) > 50 || Math.abs(currY - startY) > 50) {
			canActive = false;
			boxMove();
		} else {
			if(currObj.myType == 'main') {
				//点击到模型了
				canActive = false;
				isMove = true; //设置正在移动，让场景拖动无效

				//设置摄像机的最终位置是当前模型的
				var temp = modelArr[num];
				targetX = temp.x;
				targetY = temp.y + panY;

				//设置控制器里，摄像头的目标位置为香肠的位置（就是一直看向香肠）,这样就能实现拖动时让摄像头绕着香肠转
				controls.setTarget(cameraBox.position);
				controls.enabled = true; //启动控制器

				backIn(); //back按钮出现
			}
		}
	}
}

//摄像机移动到下一个模型
function boxMove() {
	isMove = true;

	//模型观看计数器运作
	num++;
	if(num >= modelArr.length) {
		num = 0;
	}

	//获取下一个模型的信息
	var next = modelArr[num];
	//根据模型信息，设置摄像机的移动位置
	camera_targetX = next.x;
	camera_targetY = next.y + panY;

	//香肠移动到目标位置
	TweenMax.to(cameraBox.position, 2.5, {
		x: next.x,
		y: next.y,
		z: next.z,
		ease: Quart.easeInOut
	});

	//摄像机走曲线移动到目标位置
	TweenMax.to(camera.position, 2.5, {
		bezier: [{
			x: next.x,
			y: next.y + panY,
			z: next.z + camera_dis - 10
		}, {
			x: next.x,
			y: next.y + panY,
			z: next.z + camera_dis
		}],
		ease: Quart.easeInOut,
		onComplete: function() {
			//移动结束后，将当前的场景拖动的初始位置设为摄像机的当前位置
			targetX = camera.position.x;
			targetY = camera.position.y;
			isMove = false;
			canActive = true;
		}
	});
}

//从模型主角模式退回到场景模式时，摄像机归位
function cameraRest() {
	var temp = modelArr[num];
	TweenMax.to(camera.position, 1, {
		x: temp.x,
		y: temp.y + panY,
		z: temp.z + camera_dis,
		onComplete: function() {
			canActive = true;
			isMove = false;
		}
	});

	controls.enabled = false;
}

function render() {
	if(controls) {
		//控制器update
		controls.update(delta);
	}

	camera.lookAt(cameraBox.position); //摄像机始终看向香肠

	if(!isMove) {
		camera.position.x += (targetX - camera.position.x) * 0.05;
		camera.position.y += (targetY - camera.position.y) * 0.05;
	}

	if(isBegin) {
		cloudUpdate(); //模型中的云移动

		//提示球一直看向摄像机，并让它们update
		for(var i = 0; i < ballArr.length; i++) {
			var ball = ballArr[i];
			ball.lookAt(camera.position);
			ball.update();
		}

		//粒子update
		if(particle) {
			particle.update();
		}
	}
	
	//天空盒子也可以动哟
	/*if(skyBox){
		skyBox.rotation.y+=0.1*Math.PI/180;
	}*/

	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

function cloudUpdate() {
	for(var i = 0; i < meshArr.length; i++) {
		var temp = meshArr[i];
		for(var j = 0; j < temp.children.length; j++) {
			if(temp.children[j].myType == 'cloud') {
				var __cloud = temp.children[j];
				__cloud.update();
			}
		}
	}
}

$('#back').on('touchstart', function() {
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