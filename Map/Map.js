// 3차원 세계
var scene = new THREE.Scene();

// 카메라 ( 카메라 수직 시야 각도, 가로세로 종횡비율, 시야거리 시작지점, 시야거리 끝지점
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 50000 );

// 렌더러 정의 및 크기 지정, 문서에 추가하기
var renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;		// <-- 속도가 빠르다

var model;

var loader = new THREE.TextureLoader();
var loaderMesh = new THREE.ColladaLoader();

// 바닥
var floor,floor2, floor3;
floor = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10)
);
floor2 = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10)
);
floor3 = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10)
);
loader.load(
        'http://dreamplan7.cafe24.com/canvas/img/floor1.jpg', 
        function ( texture ) {
            floor.material = new THREE.MeshStandardMaterial({map: texture});
            floor.material.map.repeat.x=3;
            floor.material.map.repeat.y=3;
            floor.material.map.wrapS=THREE.RepeatWrapping;
            floor.material.map.wrapT=THREE.RepeatWrapping;
        }
);
scene.add(floor);
scene.add(floor2);
scene.add(floor3);


floor.position.set(0, 50, 0);
floor2.position.set(0, 30, 0);
floor3.position.set(0, 10, 0);

floor.receiveShadow=true;

// 카메라의 위치 조정
camera.position.set ( 25, 5, 3 );

// 카메라가 회전하는
var controls = new THREE.OrbitControls (camera, renderer.domElement);
controls.enablePan = false;
controls.minPolarAngle = Math.PI / -2;
controls.maxPolarAngle = Math.PI / 2.1;

// 전체 조명을 추가합니다.
var light_base = new THREE.AmbientLight( 0xf0f0f0 ); // soft white light
scene.add( light_base );

var light_sun = new THREE.DirectionalLight ( 0x808080, 5.0 );
//light_sun.position.set( 200, 200, 300 );
scene.add( light_sun );
shadowBlur=10;
light_sun.castShadow=true;
light_sun.shadow.camera.left=-shadowBlur;
light_sun.shadow.camera.right=shadowBlur;
light_sun.shadow.camera.top=shadowBlur;
light_sun.shadow.camera.bottom=-shadowBlur;

// Water
var waterGeometry = new THREE.PlaneBufferGeometry( 100000, 100000 );

water = new THREE.Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load( 'http://dreamplan7.cafe24.com/canvas/img/waternormals.jpg', function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        } ),
        alpha: 1.0,
        sunDirection: light_sun.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    }
);

water.rotation.x = - Math.PI / 2;
scene.add( water );

var sky = new THREE.Sky();

sky.material.uniforms['turbidity'].value=10;
sky.material.uniforms['rayleigh'].value=2;
sky.material.uniforms['luminance'].value=1;
sky.material.uniforms['mieCoefficient'].value=0.005;
sky.material.uniforms['mieDirectionalG'].value=0.8;

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

sky.material.uniforms['sunPosition'].value = light_sun.position.copy( light_sun.position );
water.material.uniforms['sunDirection'].value.copy( light_sun.position ).normalize();

cubeCamera.update( renderer, sky );

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

    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    // 랜더링을 수행합니다.
    renderer.render( scene, camera );
};

// animate()함수를 최초에 한번은 수행해주어야 합니다.
animate();	