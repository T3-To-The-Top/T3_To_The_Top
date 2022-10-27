import { RandomObjectGeneration } from "../Random_object_generation.module.js";
import * as THREE from "../three.js-master/build/three.module.js"
import { OrbitControls } from "../three.js-master/examples/jsm/controls/OrbitControls.js"
import { ColladaLoader } from "../three.js-master/examples/jsm/loaders/ColladaLoader.js"


// 3차원 세계
var scene = new THREE.Scene();

// 카메라 ( 카메라 수직 시야 각도, 가로세로 종횡비율, 시야거리 시작지점, 시야거리 끝지점
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 50000 );

// 렌더러 정의 및 크기 지정, 문서에 추가하기
var renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;       // <-- 속도가 빠르다

var model;

var loader = new THREE.TextureLoader();
var loaderMesh = new ColladaLoader();

var objects = new RandomObjectGeneration();

// 바닥
scene.add(objects.floor);



// 카메라의 위치 조정
camera.position.set ( 25, 5, 3 );

// 카메라가 회전하는
var controls = new OrbitControls (camera, renderer.domElement);
controls.enablePan = false;
controls.minPolarAngle = Math.PI / -2;
controls.maxPolarAngle = Math.PI / 2.1;

// 전체 조명을 추가합니다.
var light_base = new THREE.AmbientLight( 0xf0f0f0 ); // soft white light
scene.add( light_base );

var light_sun = new THREE.DirectionalLight ( 0x808080, 5.0 );
//light_sun.position.set( 200, 200, 300 );
scene.add( light_sun );
var shadowBlur=10;
light_sun.castShadow=true;
light_sun.shadow.camera.left=-shadowBlur;
light_sun.shadow.camera.right=shadowBlur;
light_sun.shadow.camera.top=shadowBlur;
light_sun.shadow.camera.bottom=-shadowBlur;

var parameters = {
    distance: 400,
    inclination: 0.1,
    azimuth: 0.05
};

var cubeCamera = new THREE.CubeCamera( 0.1, 1, 512 );
scene.background = cubeCamera.renderTarget;

var theta = Math.PI * ( parameters.inclination - 0.5 );
var phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );

light_sun.position.x = parameters.distance * Math.cos( phi );
light_sun.position.y = parameters.distance * Math.sin( phi ) * Math.sin( theta );
light_sun.position.z = parameters.distance * Math.sin( phi ) * Math.cos( theta );

// ==========================
// 초기화 부분 끝
// ========================== 

var framesPerSecond=30;

// 에니메이션 효과를 자동으로 주기 위한 보조 기능입니다.
var animate = function () {
    // 프레임 처리
    setTimeout(function() {
        requestAnimationFrame(animate); 
    }, 1000 / framesPerSecond);

    // 랜더링을 수행합니다.
    renderer.render( scene, camera );
};

// animate()함수를 최초에 한번은 수행해주어야 합니다.
animate();  
