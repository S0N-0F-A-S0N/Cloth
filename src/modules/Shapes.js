import * as THREE from 'three';
import { CONFIG } from '../Config.js';
import { initInstanceObjects } from '../instance/InstanceInit.js';

// Textures
import Cloth from '../cloth-texture/fabric_85_basecolor-1K.png';
import ClothRough from '../cloth-texture/fabric_85_roughness-1K.png';
import ClothAO from '../cloth-texture/fabric_85_ambientocclusion-1K.png';
import ClothBump from '../cloth-texture/fabric_85_height-1K.png';
import ClothNormal from '../cloth-texture/fabric_85_normal-1K.png';
import ClothMetallic from '../cloth-texture/fabric_85_metallic-1K.png';

export class Shapes {
    constructor(scene) {
        this.scene = scene;
        this.loader = new THREE.TextureLoader();

        this.loadTextures();
        this.init();
    }

    loadTextures() {
        this.textures = {
            map: this.loader.load(Cloth),
            roughnessMap: this.loader.load(ClothRough),
            aoMap: this.loader.load(ClothAO),
            bumpMap: this.loader.load(ClothBump),
            normalMap: this.loader.load(ClothNormal),
            metalnessMap: this.loader.load(ClothMetallic)
        };

        // Apply anisotropy
        // We need renderer capability to do this properly, but usually we can assume a safe default or access it if we pass renderer.
        // For now let's just default to 16 or skip if not critical, but original code used `renderer.capabilities.getMaxAnisotropy()`.
        // Let's assume standard high quality.
        this.textures.map.anisotropy = 16;
    }

    init() {
        const width = CONFIG.simulation.width;
        const height = CONFIG.simulation.height;

        // Physics
        const obj = initInstanceObjects(width, height);
        this.instancePoints = obj[0];
        this.sticks = obj[1];

        // Geometry
        this.geometry = new THREE.PlaneGeometry(1, 1, width - 1, height - 1);

        // Material
        this.material = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: CONFIG.render.color,
            map: this.textures.map,
            roughnessMap: this.textures.roughnessMap,
            aoMap: this.textures.aoMap,
            bumpMap: this.textures.bumpMap,
            normalMap: this.textures.normalMap,
            metalnessMap: this.textures.metalnessMap,
            normalScale: new THREE.Vector2(0.5, 0.5),
            bumpScale: 1,
            roughness: 1,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.scale.set(CONFIG.simulation.scale, CONFIG.simulation.scale, CONFIG.simulation.scale);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.scene.add(this.mesh);
    }

    update(delta) {
        // Update Physics
        this.instancePoints.updatePoints(delta);
        for (let i = 0; i < 3; i++) {
            this.sticks.forEach(function (stick) {
                stick.updateStick(delta);
            });
        }

        // Update Geometry
        const positions = this.geometry.attributes.position.array;
        for (let i = 0; i < this.instancePoints.points.length; i++) {
            const pos = this.instancePoints.points[i].position;
            positions[i * 3] = pos.x;
            positions[i * 3 + 1] = pos.y;
            positions[i * 3 + 2] = pos.z;
        }

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.computeVertexNormals();
    }

    updateFromConfig() {
        if (this.mesh) {
            this.mesh.scale.set(CONFIG.simulation.scale, CONFIG.simulation.scale, CONFIG.simulation.scale);
            this.mesh.material.color.set(CONFIG.render.color);
        }
    }

    restart() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.geometry.dispose();
            this.material.dispose();
        }
        this.init();
    }
}
