import * as THREE from '../three.js-master/build/three.module.js';
import { TransformControls } from '../three.js-master/examples/jsm/controls/TransformControls.js';
import Stats from '../three.js-master/examples/jsm/libs/stats.module.js';
import { Flow } from '../three.js-master/examples/jsm/modifiers/CurveModifier.js';

export class RandomObjectGeneration {

    constructor(){

        // 바닥
        var floor = new THREE.Mesh(
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

        floor.position.set(0, 50, 0);
        floor.receiveShadow=true;

    }
}