import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { CONFIG } from '../Config.js';

export class Helpers {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;

        this.initStats();
        this.initControls();
    }

    initStats() {
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        const centerX = (CONFIG.simulation.width * CONFIG.simulation.scale) / 2;
        const centerZ = (CONFIG.simulation.height * CONFIG.simulation.scale) / 2;

        this.controls.target.set(centerX, 0, centerZ);

        this.controls.enablePan = false;
        this.controls.enableZoom = false;
        this.controls.enableRotate = false;

        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1.0;

        this.controls.update();
    }

    resetControls() {
        const centerX = (CONFIG.simulation.width * CONFIG.simulation.scale) / 2;
        const centerZ = (CONFIG.simulation.height * CONFIG.simulation.scale) / 2;
        this.controls.target.set(centerX, 0, centerZ);
        this.controls.update();
    }

    update() {
        if (this.stats) this.stats.update();
        if (this.controls) this.controls.update();
    }
}
