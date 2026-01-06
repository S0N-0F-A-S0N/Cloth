import * as THREE from 'three';
import { CONFIG } from '../Config.js';

export class Gizmos {
    constructor(scene, lights) {
        this.scene = scene;
        this.lights = lights;
        this.helpers = [];

        this.init();
    }

    init() {
        this.axesHelper = new THREE.AxesHelper(CONFIG.gizmos.axesSize);
        this.axesHelper.visible = CONFIG.gizmos.showAxes;
        this.scene.add(this.axesHelper);

        if (this.lights && this.lights.spotLight) {
            this.spotLightHelper = new THREE.SpotLightHelper(this.lights.spotLight);
            this.spotLightHelper.visible = CONFIG.gizmos.showSpotLightHelper;
            this.scene.add(this.spotLightHelper);
            this.helpers.push(this.spotLightHelper);
        }
    }

    update() {
        if (CONFIG.gizmos.showAxes !== this.axesHelper.visible) {
            this.axesHelper.visible = CONFIG.gizmos.showAxes;
        }

        if (this.spotLightHelper) {
            if (CONFIG.gizmos.showSpotLightHelper !== this.spotLightHelper.visible) {
                this.spotLightHelper.visible = CONFIG.gizmos.showSpotLightHelper;
            }
            if (this.spotLightHelper.visible) {
                this.spotLightHelper.update();
            }
        }
    }
}
