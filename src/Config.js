export const CONFIG = {
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
    },
    render: {
        color: '#141414',
        exposure: 1.2,
    },
    lights: {
        hemiSkyColor: 0xc4dce5,
        hemiGroundColor: 0x080820,
        hemiIntensity: 4,
        spotColor: 0xc4dce5,
        spotIntensity: 4,
        spotShadowBias: -0.0001,
        spotShadowMapSize: 4096,
    },
    cloth: {
        lockedColor: 0xff5382,
        unlockedColor: 0xffffff,
        stickColor: 0x999bbc,
    },
    gizmos: {
        showAxes: false,
        showSpotLightHelper: false,
    }
};
