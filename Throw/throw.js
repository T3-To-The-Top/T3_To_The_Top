import * as THREE from '../three.js-master/build/three.module.js';
import { GLTFLoader } from '../three.js-master/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from '../three.js-master/examples/jsm/controls/TransformControls.js';
import Stats from '../three.js-master/examples/jsm/libs/stats.module.js';
import { Flow } from '../three.js-master/examples/jsm/modifiers/CurveModifier.js';
import { CurvePathCustom } from '../Curve_path.module.js';

let playerCoord;
let person;
let mesh;
let mixer;

var clock = new THREE.Clock();

window.onload = function init()
{
	const canvas = document.getElementById( "gl-canvas" );
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.setSize(canvas.width,canvas.height);

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x0000FF);

	const camera = new THREE.PerspectiveCamera(75, canvas.width/ canvas.height, 1, 1000);
	//camera.rotation.y = 180/180*Math.PI;
	camera.position.x = -400;
	camera.position.y = 200;
	camera.position.z = 0;

	const controls = new OrbitControls(camera, renderer.domElement);

	const hlight = new THREE.AmbientLight (0x404040,50);
	scene.add(hlight);

	const loader = new GLTFLoader();
	loader.load('./first_person_cso_airbuster/scene.gltf', function(gltf){
		person = gltf.scene.children[0];
		person.scale.set(500,500,500);
		person.position.set(-300, 200, 0);

		mixer = new THREE.AnimationMixer( gltf.scene );
		var action = mixer.clipAction( gltf.animations[0] );
		action.play();

		scene.add(gltf.scene);
		animate(10);
	}, undefined, function (error) {
		console.error(error);
	});

	if(person){
		console.log(playerCoord);
	}

	if(playerCoord){
		playerCoord = ["player",person.position.x, person.position.y, person.position.z];
	}


	if(playerCoord){
		console.log(playerCoord);
	}
    
    const curve = new CurvePathCustom(new THREE.Vector3(-220, 200, 0), new THREE.Vector3(0, 0, 0,), new THREE.Vector3(-50, 100, 200), 0xffff00);
    scene.add(curve.line);

    /*const ringGeometry = new THREE.RingGeometry(1, 2, 50);
    const ringMeterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide});
    ringGeometry.rotateY(Math.PI / -2)
    const ringMesh = new THREE.Mesh( ringGeometry, ringMeterial );

    flow = new Flow(ringMesh);
    flow.updateCurve(0, curve);
    scene.add(flow.object3D);*/

	window.addEventListener('mousedown', (event) => {
		event.preventDefault();
	
		var vector = new THREE.Vector3();//      
		vector.set(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		vector.unproject( camera );
	
		var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
		var intersects = raycaster.intersectObjects(scene.children);
	
		if (intersects.length > 0) {
			var selected = intersects[0];//      
			console.log("x  :"+selected.point.x);
			console.log("y  :"+selected.point.y);
			console.log("z  :"+selected.point.z);
		} 
	})

	function animate(time) {
		time *=0.001;

		var delta = clock.getDelta();

		if ( mixer ) mixer.update( delta );

		renderer.render(scene,camera);
		requestAnimationFrame(animate);
	}
}