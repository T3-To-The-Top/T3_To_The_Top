/**
 * 장애물 박스 만드는 클래스
 */

import * as THREE from '../three.js-master/build/three.module.js';

var step = 0;

export class RandomObjectGeneration {

    constructor(posX, posY, posZ, sizeX, sizeY, sizeZ, texture) {

        // BOX 만들고 크기 지정 -> Vertex
        this.geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);

        // 색깔 지정 -> Fragment
        this.loader = new THREE.TextureLoader();
        this.material = new THREE.MeshBasicMaterial({ map: this.loader.load(texture) });

        // Render를 하는 API (매쉬 추가)
        this.floor = new THREE.Mesh(this.geometry, this.material);

        // 다 만들어놓은 애의 위치를 지정한다.
        this.floor.position.x = posX;
        this.floor.position.y = posY;
        this.floor.position.z = posZ;
		
    }
}