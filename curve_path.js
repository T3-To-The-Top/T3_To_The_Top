import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let container, stats;

let camera, scene, renderer, splineCamera, cameraHelper, cameraEye;

const direction = new THREE.Vector3();
const binormal = new THREE.Vector3();
const normal = new THREE.Vector3();
const position = new THREE.Vector3();
const lookAt = new THREE.Vector3();

// Keep a dictionary of Curve instances -> QuadraticBezierCurve3 사용 3차원 커브 생성 
const splines = {
    testCurve : new THREE.QuadraticBezierCurve3(new THREE.Vector3(-100, -100, 0), new THREE.Vector3(-100, 100, 0), new THREE.Vector3(100, 100, 0))
};

let parent, tubeGeometry, mesh;

// 프로그램 제어용 파라미터
const params = {
    spline: 'testCurve',
    scale: 4,
    extrusionSegments: 100,
    radiusSegments: 3,
    animationView: false,
    lookAhead: false,
    cameraHelper: false,
};

const material = new THREE.MeshLambertMaterial({ color: 0xff00ff });

const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.3, wireframe: true, transparent: true });

function addTube() {

    if (mesh !== undefined) {

        parent.remove(mesh);
        mesh.geometry.dispose();

    }

    const extrudePath = splines[params.spline];

    tubeGeometry = new THREE.TubeGeometry(extrudePath, params.extrusionSegments, 2, params.radiusSegments, false);

    addGeometry(tubeGeometry);

    setScale();

}

function setScale() {

    mesh.scale.set(params.scale, params.scale, params.scale);

}


function addGeometry(geometry) {

    // 3D shape

    mesh = new THREE.Mesh(geometry, material);
    const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
    mesh.add(wireframe);

    parent.add(mesh);

}

function animateCamera() {

    cameraHelper.visible = params.cameraHelper;
    cameraEye.visible = params.cameraHelper;

}

init();
animate();

function init() {

    container = document.getElementById('container');

    // camera (test for movemont of line camera)

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10000);
    camera.position.set(0, 50, 500);

    // scene

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // light

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);

    // tube (make tube for Path)

    parent = new THREE.Object3D();
    scene.add(parent);

    // main Camera for following movement(Path).
    splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000);
    splineCamera.rotateX(10)
    parent.add(splineCamera);

    //cameraHelper
    cameraHelper = new THREE.CameraHelper(splineCamera);
    scene.add(cameraHelper);

    // Call make tube func
    addTube();

    // debug camera (showing the near and far site of camera)
    cameraEye = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshBasicMaterial({ color: 0xdddddd }));
    parent.add(cameraEye);

    //set parameter
    cameraHelper.visible = params.cameraHelper;
    cameraEye.visible = params.cameraHelper;

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // stats
    stats = new Stats();
    container.appendChild(stats.dom);

    // dat.GUI (control)
    const gui = new GUI({ width: 285 });
    const folderGeometry = gui.addFolder('Geometry');
    folderGeometry.add(params, 'scale', 2, 10).step(2).onChange(function () {

        setScale();

    });
    folderGeometry.add(params, 'extrusionSegments', 50, 500).step(50).onChange(function () {

        addTube();

    });
    folderGeometry.add(params, 'radiusSegments', 2, 12).step(1).onChange(function () {

        addTube();

    });

    folderGeometry.open();

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

    // for control test camera (Orbit)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 100;
    controls.maxDistance = 2000;

    //for resizing respond
    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

// call Animate render.

function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}

function render() {

    // animate camera along spline

    const time = Date.now();
    const looptime = 20 * 1000;
    const t = (time % looptime) / looptime;

    tubeGeometry.parameters.path.getPointAt(t, position);
    position.multiplyScalar(params.scale);

    // interpolation

    const segments = tubeGeometry.tangents.length;
    const pickt = t * segments;
    const pick = Math.floor(pickt);
    const pickNext = (pick + 1) % segments;

    binormal.subVectors(tubeGeometry.binormals[pickNext], tubeGeometry.binormals[pick]);
    binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);

    tubeGeometry.parameters.path.getTangentAt(t, direction);
    const offset = 15;

    normal.copy(binormal).cross(direction);

    // we move on a offset on its binormal

    position.add(normal.clone().multiplyScalar(offset));

    splineCamera.position.copy(position);
    cameraEye.position.copy(position);

    // using arclength for stablization in look ahead

    tubeGeometry.parameters.path.getPointAt((t + 30 / tubeGeometry.parameters.path.getLength()) % 1, lookAt);
    lookAt.multiplyScalar(params.scale);

    // camera orientation 2 - up orientation via normal

    if (!params.lookAhead) lookAt.copy(position).add(direction);
    splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
    splineCamera.quaternion.setFromRotationMatrix(splineCamera.matrix);

    cameraHelper.update();

    renderer.render(scene, params.animationView === true ? splineCamera : camera);

}