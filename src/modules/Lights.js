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

        this.spotLight.position.set(
            CONFIG.lights.spotInitialPos.x,
            CONFIG.lights.spotInitialPos.y,
            CONFIG.lights.spotInitialPos.z
        );

        this.scene.add(this.spotLight);
    }

    updatePosition(targetPosition) {
        if (this.spotLight) {
            this.spotLight.position.set(
                targetPosition.x + CONFIG.lights.spotOffset.x,
                targetPosition.y + CONFIG.lights.spotOffset.y,
                targetPosition.z + CONFIG.lights.spotOffset.z
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
