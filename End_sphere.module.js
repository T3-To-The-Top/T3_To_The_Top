/**
 * 도착지 구체를 만드는 클래스
 */
import * as THREE from './three.js-master/build/three.module.js';

export class EndSphere {

    constructor(radius, posX, posY, posZ, texture) {
        // 구체 정의
        this.geometry = new THREE.SphereGeometry(radius);
        this.loader = new THREE.TextureLoader();
        this.material = new THREE.MeshBasicMaterial({ color: 0x33FFFF });

        //구체 Mesh 정의
        this.end = new THREE.Mesh(this.geometry, this.material);

        // 구체 위치 추가
        this.end.position.x = posX;
        this.end.position.y = posY;
        this.end.position.z = posZ;
    }
}