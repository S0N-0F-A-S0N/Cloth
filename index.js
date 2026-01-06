import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import Stats from 'three/addons/libs/stats.module.js';

import { initInstanceObjects } from './src/instance/InstanceInit.js';

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
let dist, order;
let hemiLight, spotLight;
let start = Date.now();

// let color = '#403d39';
let color = '#141414';
let scale = 0.1;
const width = 51;
const height = 51;

//

window.onload = function () {

    init();
    initObjects();
    initControls();
    initStats();

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
    camera.position.set((width * scale) + camOffset, 2, (height * scale) + camOffset);

    scene = new THREE.Scene();

    cloth.anisotropy = renderer.capabilities.getMaxAnisotropy();

    hemiLight = new THREE.HemisphereLight(0xc4dce5, 0x080820, 4);
    scene.add(hemiLight);

    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;

    spotLight = new THREE.SpotLight(0xc4dce5, 4);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.mapSize = new THREE.Vector2(1024*4,1024*4);
    scene.add(spotLight)
}

//

function initObjects() {
 
    var obj = initInstanceObjects(width, height);
    instancePoints = obj[0];
    sticks = obj[1];

    // Create an indexed PlaneGeometry
    // width segments = width - 1, height segments = height - 1
    shapeGeometry = new THREE.PlaneGeometry(1, 1, width - 1, height - 1);

    //

    var material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,

        color: color,

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

    shape.scale.set(scale, scale, scale);
    shape.castShadow = true;
    shape.receiveShadow = true;

    scene.add(shape);

}

//

function initControls() {

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set( (width * scale) / 2, 0, (height * scale) / 2 );

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
    instancePoints.gravity = instancePoints.gravity * -1;
}   


