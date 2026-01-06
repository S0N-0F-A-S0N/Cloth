import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Stats from 'three/addons/libs/stats.module.js';

import { initInstanceObjects } from './src/instance/InstanceInit.js';
import { CONFIG } from './src/Config.js';
import { Pane } from 'tweakpane';

//textures
import Cloth from './src/cloth-texture/fabric_85_basecolor-1K.png';
import ClothRough from './src/cloth-texture/fabric_85_roughness-1K.png';
import ClothAO from './src/cloth-texture/fabric_85_ambientocclusion-1K.png';
import ClothBump from './src/cloth-texture/fabric_85_height-1K.png';
import ClothNormal from './src/cloth-texture/fabric_85_normal-1K.png';
import ClothMetallic from './src/cloth-texture/fabric_85_metallic-1K.png';

require('normalize.css/normalize.css');
require("./src/index.css");

//

const loader = new THREE.TextureLoader();
const cloth = loader.load(Cloth);
const clothRough = loader.load(ClothRough);
const clothAO = loader.load(ClothAO);
const clothBump = loader.load(ClothBump);
const clothNormal = loader.load(ClothNormal);
const clothMetallic = loader.load(ClothMetallic);

//

let renderer, scene, camera, controls;
let container, stats, clock;
let instancePoints, shapeGeometry, shape, sticks;
let hemiLight, spotLight;

//

window.onload = function () {

    init();
    initObjects();
    initControls();
    initStats();
    initTweakpane();

    animate();
}

//

function init() {

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container = document.getElementById('canvas');
    container.appendChild(renderer.domElement);

    var camOffset = 2;
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(
        (CONFIG.simulation.width * CONFIG.simulation.scale) + camOffset,
        2,
        (CONFIG.simulation.height * CONFIG.simulation.scale) + camOffset
    );

    scene = new THREE.Scene();

    cloth.anisotropy = renderer.capabilities.getMaxAnisotropy();

    hemiLight = new THREE.HemisphereLight(CONFIG.lights.hemiSkyColor, CONFIG.lights.hemiGroundColor, CONFIG.lights.hemiIntensity);
    scene.add(hemiLight);

    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = CONFIG.render.exposure;
    renderer.shadowMap.enabled = true;

    spotLight = new THREE.SpotLight(CONFIG.lights.spotColor, CONFIG.lights.spotIntensity);
    spotLight.castShadow = true;
    spotLight.shadow.bias = CONFIG.lights.spotShadowBias;
    spotLight.shadow.mapSize = new THREE.Vector2(CONFIG.lights.spotShadowMapSize, CONFIG.lights.spotShadowMapSize);
    scene.add(spotLight)
}

//

function initObjects() {
 
    var obj = initInstanceObjects(CONFIG.simulation.width, CONFIG.simulation.height);
    instancePoints = obj[0];
    sticks = obj[1];

    // Create an indexed PlaneGeometry
    // width segments = width - 1, height segments = height - 1
    shapeGeometry = new THREE.PlaneGeometry(1, 1, CONFIG.simulation.width - 1, CONFIG.simulation.height - 1);

    //

    var material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,

        color: CONFIG.render.color,

        roughnessMap: clothRough,
        aoMap: clothAO,
        bumpMap: clothBump,
        normalMap: clothNormal,
        metalnessMap: clothMetallic,

        normalScale: new THREE.Vector2(0.5,0.5),
        bumpScale: 1,
        roughness: 1,

    });


    material.color.anisotropy = 16;

    shape = new THREE.Mesh(shapeGeometry, material);

    shape.scale.set(CONFIG.simulation.scale, CONFIG.simulation.scale, CONFIG.simulation.scale);
    shape.castShadow = true;
    shape.receiveShadow = true;

    scene.add(shape);

}

//

function initControls() {

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set( (CONFIG.simulation.width * CONFIG.simulation.scale) / 2, 0, (CONFIG.simulation.height * CONFIG.simulation.scale) / 2 );

    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = false;

    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    controls.update();
}



//

function initStats() {

    // var axesHelper = new THREE.AxesHelper(10);
    // scene.add(axesHelper);

    stats = new Stats();
    document.body.appendChild(stats.dom);

}

//

function initTweakpane() {
    const pane = new Pane({ title: 'Configuration' });

    // Procedurally build the pane from CONFIG
    function addToPane(folder, obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                const subFolder = folder.addFolder({ title: key });
                addToPane(subFolder, obj[key]);
            } else {
                folder.addBinding(obj, key).on('change', (ev) => {
                    handleConfigChange(key, ev.value);
                });
            }
        }
    }

    addToPane(pane, CONFIG);

    // Add manual actions if needed
    pane.addButton({ title: 'Restart Simulation' }).on('click', () => {
        restartSimulation();
    });
}

function handleConfigChange(key, value) {
    // Handle specific updates that require more than just changing the value
    switch(key) {
        case 'width':
        case 'height':
            // These require restart to take effect on geometry
            // restartSimulation(); // Can't auto restart on slider drag, too heavy
            break;
        case 'scale':
             if (shape) shape.scale.set(value, value, value);
             break;
        case 'color':
            if (shape && shape.material) shape.material.color.set(value);
            break;
        case 'exposure':
            if (renderer) renderer.toneMappingExposure = value;
            break;
        case 'hemiIntensity':
            if (hemiLight) hemiLight.intensity = value;
            break;
        case 'spotIntensity':
            if (spotLight) spotLight.intensity = value;
            break;
        // Physics params (gravity, friction, etc) are read directly from CONFIG in the loop/classes
    }
}

function restartSimulation() {
    scene.remove(shape);
    shapeGeometry.dispose();
    shape.material.dispose();

    // Dispose sticks and points if necessary?
    // JS GC handles it if we drop references.

    initObjects();

    // Update camera target potentially
    controls.target.set( (CONFIG.simulation.width * CONFIG.simulation.scale) / 2, 0, (CONFIG.simulation.height * CONFIG.simulation.scale) / 2 );
    controls.update();
}

//

function animate() {

    requestAnimationFrame(animate);

    let delta = clock.getDelta();

    // if less than 5 fps pause animation to stop glitches
    if (delta > 1 / 5) {
        delta = 0;
    }

    instancePoints.updatePoints(delta);
    for (let i = 0; i < 3; i++) {
        sticks.forEach(function (stick) {
            stick.updateStick(delta);
        });
    }


    const positions = shapeGeometry.attributes.position.array;
    for (let i = 0; i < instancePoints.points.length; i++) {

        const pos = instancePoints.points[i].position;

        positions[i * 3] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;

    }

    shapeGeometry.attributes.position.needsUpdate = true;
    shapeGeometry.computeVertexNormals();

    spotLight.position.set(
        camera.position.x + 1,
        camera.position.y + 1,
        camera.position.z + 1,
    );

    controls.update();
    stats.update();

    renderer.render(scene, camera);

}

//
// EVENT LISTENERS
//

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('click', onClick, false);

//

function onWindowResize() {
    container = document.getElementById('canvas');

    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(width, height);
}

//

function onClick(e) {
    // Check if the click originated from the tweakpane container
    if (e.target.closest('.tp-dfwv')) {
        return;
    }

    CONFIG.simulation.gravity = CONFIG.simulation.gravity * -1;
    // We also need to update the binding in tweakpane if we want it to reflect
    // But since we are procedurally generating, we don't have direct ref to the binding instance easily.
    // However, Tweakpane polls? No.
    // Ideally we refresh the pane, but for now let's just update the value.
}
