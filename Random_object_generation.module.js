import * as THREE from '../three.js-master/build/three.module.js';
import { TransformControls } from '../three.js-master/examples/jsm/controls/TransformControls.js';
import Stats from '../three.js-master/examples/jsm/libs/stats.module.js';
import { Flow } from '../three.js-master/examples/jsm/modifiers/CurveModifier.js';
import { Object3D } from './three.js-master/build/three.module.js';

export class RandomObjectGeneration {

    constructor(posX, posY, posZ, sizeX, sizeY, sizeZ){

        this.geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
        this.material = new THREE.MeshBasicMaterial({color: 0x00ff00})
        // 바닥
        this.floor = new THREE.Mesh( this.geometry, this.material);
        this.floor.position.x = posX;
        this.floor.position.y = posY;
        this.floor.position.z = posZ;

    }
}