/**
 * 도착지 구체를 만드는 클래스
 */
import * as THREE from './three.js-master/build/three.module.js';

export class EndSphere {

    constructor(radius, posX, posY, posZ, texture) {
        this.geometry = new THREE.SphereGeometry(radius);
        this.loader = new THREE.TextureLoader();
        this.material = new THREE.MeshBasicMaterial({ color: 0x33FFFF });

        this.end = new THREE.Mesh(this.geometry, this.material);

        this.end.position.x = posX;
        this.end.position.y = posY;
        this.end.position.z = posZ;
    }
}