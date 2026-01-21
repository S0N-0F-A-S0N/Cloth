import * as THREE from 'three';
import { CONFIG } from '../Config.js';
import { Lights } from '../modules/Lights.js';
import { Helpers } from '../modules/Helpers.js';
import { Gizmos } from '../modules/Gizmos.js';
import { Shapes } from '../modules/Shapes.js';
import { UI } from '../modules/UI.js';

export class App {
    static _instance = null;

    constructor() {
        if (App._instance) {
            return App._instance;
        }
        App._instance = this;

        this.init();
    }

    static get instance() {
        if (!App._instance) {
            App._instance = new App();
        }
        return App._instance;
    }

    init() {
        this.clock = new THREE.Clock();

        this.initRenderer();
        this.initScene();
        this.initCamera();

        // Modules
        this.lights = new Lights(this.scene);
        this.helpers = new Helpers(this.camera, this.renderer);
        this.gizmos = new Gizmos(this.scene, this.lights);
        this.shapes = new Shapes(this.scene);
        this.ui = new UI(this);

        // Event Listeners
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        window.addEventListener('click', this.onClick.bind(this), false);

        this.animate();
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = CONFIG.render.exposure;
        this.renderer.shadowMap.enabled = true;

        this.container = document.getElementById('canvas');
        if (this.container) {
            this.container.appendChild(this.renderer.domElement);
        } else {
            console.error('Canvas container not found');
        }
    }

    initScene() {
        this.scene = new THREE.Scene();
    }

    initCamera() {
        const targetX = (CONFIG.simulation.width * CONFIG.simulation.scale);
        const targetZ = (CONFIG.simulation.height * CONFIG.simulation.scale);

        this.camera = new THREE.PerspectiveCamera(
            CONFIG.app.camera.fov,
            window.innerWidth / window.innerHeight,
            CONFIG.app.camera.near,
            CONFIG.app.camera.far
        );
        this.camera.position.set(
            targetX + CONFIG.app.camera.offset,
            CONFIG.app.camera.height,
            targetZ + CONFIG.app.camera.offset
        );
    }

    onWindowResize() {
        this.container = document.getElementById('canvas');
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
    }

    onClick(e) {
        if (e.target.closest('.tp-dfwv')) return;

        // Delegate to Shapes or handle global click logic
        CONFIG.simulation.gravity = CONFIG.simulation.gravity * -1;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        let delta = this.clock.getDelta();
        if (delta > CONFIG.app.maxDelta) delta = 0;

        // Update modules
        this.shapes.update(delta);
        this.helpers.update();
        this.gizmos.update();

        // Update lights that follow camera/scene logic if needed
        // Original code updated spotlight based on camera position
        if (this.lights) {
            this.lights.updatePosition(this.camera.position);
        }

        this.renderer.render(this.scene, this.camera);
    }
}
