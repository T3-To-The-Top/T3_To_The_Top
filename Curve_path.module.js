import * as THREE from '../three.js-master/build/three.module.js';
import { TransformControls } from '../three.js-master/examples/jsm/controls/TransformControls.js';
import Stats from '../three.js-master/examples/jsm/libs/stats.module.js';
import { Flow } from '../three.js-master/examples/jsm/modifiers/CurveModifier.js';

export class CurvePathCustom {
    constructor(v1, v2, v3, colors) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.colors = colors;

        this.curve = new THREE.QuadraticBezierCurve3(
            v1,
            v2,
            v3
        );
    
        this.points = this.curve.getPoints( 50 );
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints( this.points );
        this.curveMaterial = new THREE.LineBasicMaterial( {color: this.colors} );
        this.line = new THREE.Line( this.curveGeometry, this.curveMaterial );
    }
}