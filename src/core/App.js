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
        const camOffset = 2;
        const targetX = (CONFIG.simulation.width * CONFIG.simulation.scale);
        const targetZ = (CONFIG.simulation.height * CONFIG.simulation.scale);

        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(targetX + camOffset, 2, targetZ + camOffset);
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
        // For now, reverse gravity as in original
        CONFIG.simulation.gravity = CONFIG.simulation.gravity * -1;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        let delta = this.clock.getDelta();
        if (delta > 1 / 5) delta = 0;

        // Update modules
        this.shapes.update(delta);
        this.helpers.update();
        this.gizmos.update(); // If gizmos need updates (e.g. following lights)

        this.renderer.render(this.scene, this.camera);
    }
}
