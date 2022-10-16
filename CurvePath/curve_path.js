import * as THREE from '../three.js-master/build/three.module.js';
import { TransformControls } from '../three.js-master/examples/jsm/controls/TransformControls.js';
import Stats from '../three.js-master/examples/jsm/libs/stats.module.js';
import { Flow } from '../three.js-master/examples/jsm/modifiers/CurveModifier.js';

const ACTION_SELECT = 1, ACTION_NONE = 0;
const curveHandles = [];
const mouse = new THREE.Vector2();

let stats;
let scene,
    camera,
    renderer,
    rayCaster,
    control,
    flow,
    action = ACTION_NONE;

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set(2, 2, 4);
    camera.lookAt(scene.position);

    const curve = new THREE.QuadraticBezierCurve(
        new THREE.Vector2( -10, 0 ),
        new THREE.Vector2( 20, 15 ),
        new THREE.Vector2( 10, 0 )
    );

    const points = curve.getPoints( 50 );
    const curveGeometry = new THREE.BufferGeometry().setFromPoints( points );
    const curveMaterial = new THREE.LineBasicMaterial( {color: 0xffff00} );
    const curveLine = new THREE.Line( curveGeometry, curveMaterial );

    scene.add( curveLine );
    //

    const light = new THREE.DirectionalLight(0xffaa33);
    light.position.set(- 10, 10, 10);
    light.intensity = 1.0;
    scene.add(light);

    const light2 = new THREE.AmbientLight(0x003973);
    light2.intensity = 1.0;
    scene.add(light2);

    //
    const ringGeometry = new THREE.RingGeometry(0.1, 0.2, 50);
    const ringMeterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide});
    const ringMesh = new THREE.Mesh( ringGeometry, ringMeterial);

    flow = new Flow(ringMesh);
    flow.updateCurve(0, curve);
    scene.add(flow.object3D);

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
    console.log(stats);
    document.body.appendChild(stats.dom);

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

    if (action === ACTION_SELECT) {

        rayCaster.setFromCamera(mouse, camera);
        action = ACTION_NONE;
        const intersects = rayCaster.intersectObjects(curveHandles, false);
        if (intersects.length) {

            const target = intersects[0].object;
            control.attach(target);
            scene.add(control);

        }

    }

    if (flow) {

        flow.moveAlongCurve(0.001);

    }

    render();

}

function render() {

    renderer.render(scene, camera);

    stats.update();

}
