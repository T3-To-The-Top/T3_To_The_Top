import * as THREE from '../three.js-master/build/three.module.js';
import { GLTFLoader } from '../three.js-master/examples/jsm/loaders/GLTFLoader.js'
import { Flow } from '../three.js-master/examples/jsm/modifiers/CurveModifier.js';
import { CurvePathCustom } from '../Curve_path.module.js';

let person;
let mixer;

var clock = new THREE.Clock();;
let flow;
let potalMove = false;

window.onload = function init()
{
	const canvas = document.getElementById( "gl-canvas" );
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.setSize(1280,720);

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x0000FF);

	const camera = new THREE.PerspectiveCamera(75, 1280/720, 1, 1000);
	//camera.rotation.y = 180/180*Math.PI;

	const hlight = new THREE.AmbientLight (0x404040,50);
	scene.add(hlight);

	const loader = new GLTFLoader();
	loader.load('./first_person_cso_airbuster/scene.gltf', function(gltf){
		person = gltf.scene.children[0];
		person.scale.set(500,500,500);
		person.position.set(0, 0, 0);

		mixer = new THREE.AnimationMixer( gltf.scene );
		var action = mixer.clipAction( gltf.animations[0] );
		action.play();

		scene.add(gltf.scene);
		animate(10);
	}, undefined, function (error) {
		console.error(error);
	});
    
    const curve = new CurvePathCustom(new THREE.Vector3(-220, 200, 0), new THREE.Vector3(0, 0, 0,), new THREE.Vector3(-50, 100, 200), 0xffff00);
    scene.add(curve.line);

    const ringGeometry = new THREE.RingGeometry(1, 2, 50);
    const ringMeterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide});
    ringGeometry.rotateY(Math.PI / -2)
    const ringMesh = new THREE.Mesh( ringGeometry, ringMeterial );

    flow = new Flow(ringMesh);
    flow.updateCurve(0, curve.curve);
    scene.add(flow.object3D);

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
	});

    window.addEventListener('keydown', (event) => {
        event.preventDefault();
        potalMove = !potalMove;
    });

	function animate(time) {
		time *=0.001;

		if(person){
			person.position.set(
				camera.position.x - Math.sin(camera.rotation.y + Math.PI/6) * 0.75,
				camera.position.y - 0.5 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.01,
				-15 + camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.75
			);

			person.rotation.z = 180/180*Math.PI;
		}

		var delta = clock.getDelta();

		if ( mixer ) mixer.update( delta );

		renderer.render(scene,camera);

        if(potalMove){
            flow.moveAlongCurve(0.0009);
        }
		requestAnimationFrame(animate);
	}
}