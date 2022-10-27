import * as THREE from '../three.js-master/build/three.module.js';
import { TransformControls } from '../three.js-master/examples/jsm/controls/TransformControls.js';
import Stats from '../three.js-master/examples/jsm/libs/stats.module.js';
import { Flow } from '../three.js-master/examples/jsm/modifiers/CurveModifier.js';
import { Object3D } from './three.js-master/build/three.module.js';

export class RandomObjectGeneration {

    constructor(){

        // 바닥
        this.floor = new Object3D( new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 10)
        ));

        this.floor.position.set(0, 50, 0);
        this.floor.receiveShadow=true;

    }
}