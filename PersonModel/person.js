window.onload = function init()
{
	const canvas = document.getElementById( "gl-canvas" );
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.setSize(canvas.width,canvas.height);

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x0000FF);

	camera = new THREE.PerspectiveCamera(75,canvas.width / canvas.height,0.1, 1000);
	camera.rotation.y = 45/180*Math.PI;
	camera.position.x = 150;
	camera.position.y = 150;
	camera.position.z = 150;

	const controls = new THREE.OrbitControls(camera, renderer.domElement);

	hlight = new THREE.AmbientLight (0x404040,50);
	scene.add(hlight);

	const loader = new THREE.GLTFLoader();
	loader.load('./first_person_cso_airbuster/scene.gltf', function(gltf){
		person = gltf.scene.children[0];
		person.scale.set(500,500,500);
		person.position.set(0, 0, 0);

		scene.add(gltf.scene);
		animate(10);

	}, undefined, function (error) {
		console.error(error);
	});

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
		renderer.render(scene,camera);
		requestAnimationFrame(animate);
	}
}
