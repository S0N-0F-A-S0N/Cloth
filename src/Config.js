import * as THREE from 'three';

export const CONFIG = {
    app: {
        camera: {
            offset: 2,
            height: 2,
            fov: 40,
            near: 1,
            far: 1000,
        },
        maxDelta: 1/5,
    },
    simulation: {
        width: 51,
        height: 51,
        scale: 0.1,
        gravity: -9.81,
        friction: 0.999,
        bounce: 0.9,
        wind: 0,
        timeStep: 1000/30,
        pointRadius: 0.1,
        iterations: 3,
    },
    render: {
        color: '#141414',
        exposure: 1.2,
    },
    materials: {
        cloth: {
            side: THREE.DoubleSide,
            normalScale: { x: 0.5, y: 0.5 },
            bumpScale: 1,
            roughness: 1,
            anisotropy: 16,
        },
        point: {
            color: 0xffffff,
            lockedColor: 0xff5382,
            unlockedColor: 0xffffff,
        }
    },
    shapes: {
        clothGeometry: {
            width: 1,
            height: 1,
        },
        pointGeometry: {
            widthSegments: 16,
            heightSegments: 16,
        }
    },
    lights: {
        hemiSkyColor: 0xc4dce5,
        hemiGroundColor: 0x080820,
        hemiIntensity: 4,
        spotColor: 0xc4dce5,
        spotIntensity: 4,
        spotShadowBias: -0.0001,
        spotShadowMapSize: 4096,
        spotOffset: { x: 1, y: 1, z: 1 },
        spotInitialPos: { x: 10, y: 10, z: 10 },
    },
    cloth: { // Keeping for backward compatibility with `stick.js` until refactored
        lockedColor: 0xff5382,
        unlockedColor: 0xffffff,
        stickColor: 0x999bbc,
    },
    gizmos: {
        showAxes: false,
        axesSize: 10,
        showSpotLightHelper: false,
    }
};
