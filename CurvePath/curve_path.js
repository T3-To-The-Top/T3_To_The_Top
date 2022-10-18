import * as THREE from '../three.js-master/build/three.module.js';
import { TransformControls } from '../three.js-master/examples/jsm/controls/TransformControls.js';
import Stats from '../three.js-master/examples/jsm/libs/stats.module.js';
import { Flow } from '../three.js-master/examples/jsm/modifiers/CurveModifier.js';
import { CurvePathCustom } from '../Curve_path.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ACTION_SELECT = 1, ACTION_NONE = 0;
let clock = new THREE.Clock();
const mouse = new THREE.Vector2();
const position = new THREE.Vector3();

let curveObj;
let curve ;
let curveLine ;

let stats;
let scene,
    camera,
    splineCamera,
    renderer,
    rayCaster,
    control,
    flow,
    cameraHelper, 
    cameraEye,
    action = ACTION_NONE;

const params = {
    spline: 'testCurve',
    scale: 4,
    extrusionSegments: 100,
    animationView: false,
    lookAhead: false,
    cameraHelper: false
};

init();
animate();

function animateCamera() {

    cameraHelper.visible = params.cameraHelper;
    cameraEye.visible = params.cameraHelper;

}

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set(30, 30, 10);
    camera.lookAt(scene.position);

    splineCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 100);
    
    //custom curve class in Curve_path.module.js
    curveObj = new CurvePathCustom(new THREE.Vector3( -100, 0, 1 ), new THREE.Vector3( 200, 150, 1 ), new THREE.Vector3( 100, 0, 1 ), 0xffff00);
    curve = curveObj.curve;
    curveLine = curveObj.line;
    scene.add( curveLine );

    const light = new THREE.DirectionalLight(0xffaa33);
    light.position.set(- 10, 10, 10);
    light.intensity = 1.0;
    scene.add(light);

    const light2 = new THREE.AmbientLight(0x003973);
    light2.intensity = 1.0;
    scene.add(light2);

    cameraHelper = new THREE.CameraHelper(splineCamera);
    scene.add(cameraHelper);

    cameraEye = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshBasicMaterial({ color: 0xdddddd }));
    scene.add(cameraEye);

    cameraHelper.visible = false;
    //
    const ringGeometry = new THREE.RingGeometry(1, 2, 50);
    const ringMeterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide});
    ringGeometry.rotateY(Math.PI / -2)
    const ringMesh = new THREE.Mesh( ringGeometry, ringMeterial );

    flow = new Flow(ringMesh);
    flow.updateCurve(0, curve);
    scene.add(flow.object3D);

    const gui = new GUI({ width: 285 });

    const folderCamera = gui.addFolder('Camera');

    folderCamera.add(params, 'animationView').onChange(function () {

        animateCamera();

    });
    folderCamera.add(params, 'lookAhead').onChange(function () {

        animateCamera();

    });
    folderCamera.add(params, 'cameraHelper').onChange(function () {

        animateCamera();

    });
    folderCamera.open();

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    rayCaster = new THREE.Raycaster();
    control = new TransformControls(camera, renderer.domElement);
    control.addEventListener('dragging-changed', function (event) {

        if (!event.value) {

            const points = curve.getPoints(50);
            curveLine.geometry.setFromPoints(points);
            flow.updateCurve(0, curve);
        }

    });

    stats = new Stats();
    document.body.appendChild(stats.dom);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 100;
    controls.maxDistance = 2000;

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onPointerDown(event) {

    action = ACTION_SELECT;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

function animate() {

    requestAnimationFrame(animate);

    if (flow) {

        flow.moveAlongCurve(0.0009);

    }

    render();

}

function render() {

    const time = clock.getElapsedTime();
    const looptime = 20;
    const t = (time % looptime) / looptime;
    const t2 = ((time + 0.1) % looptime) / looptime;
    const pos = curve.getPointAt(t);
    const pos2 = curve.getPointAt(t2);

    curve.getPointAt(t,position)

    splineCamera.position.copy(pos);
    splineCamera.lookAt(pos2);
    
    cameraEye.position.copy(position);

    cameraHelper.update();

    renderer.render(scene, params.animationView === true ? splineCamera : camera);

    stats.update();
}
