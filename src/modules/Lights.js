import * as THREE from 'three';
import { CONFIG } from '../Config.js';

export class Lights {
    constructor(scene) {
        this.scene = scene;
        this.init();
    }

    init() {
        this.hemiLight = new THREE.HemisphereLight(
            CONFIG.lights.hemiSkyColor,
            CONFIG.lights.hemiGroundColor,
            CONFIG.lights.hemiIntensity
        );
        this.scene.add(this.hemiLight);

        this.spotLight = new THREE.SpotLight(
            CONFIG.lights.spotColor,
            CONFIG.lights.spotIntensity
        );
        this.spotLight.castShadow = true;
        this.spotLight.shadow.bias = CONFIG.lights.spotShadowBias;
        this.spotLight.shadow.mapSize = new THREE.Vector2(
            CONFIG.lights.spotShadowMapSize,
            CONFIG.lights.spotShadowMapSize
        );

        // Initial position will be set in update, but let's give it a default
        this.spotLight.position.set(10, 10, 10);

        this.scene.add(this.spotLight);
    }

    updatePosition(targetPosition) {
        if (this.spotLight) {
            this.spotLight.position.set(
                targetPosition.x + 1,
                targetPosition.y + 1,
                targetPosition.z + 1
            );
        }
    }

    updateFromConfig() {
        this.hemiLight.color.setHex(CONFIG.lights.hemiSkyColor);
        this.hemiLight.groundColor.setHex(CONFIG.lights.hemiGroundColor);
        this.hemiLight.intensity = CONFIG.lights.hemiIntensity;

        this.spotLight.color.setHex(CONFIG.lights.spotColor);
        this.spotLight.intensity = CONFIG.lights.spotIntensity;
        this.spotLight.shadow.bias = CONFIG.lights.spotShadowBias;
    }
}
