import { Vector3 } from 'three';
import { CONFIG } from '../Config.js';

//

export default class Point {

    constructor(x, y, z, locked) {

        this.position = new Vector3(x, y, z);
        this.prevPosition;
        this.locked = locked

        this.updateColor();

        this.setPreviousPosition(x, y, z);

    }

    //

    test() {
        this.position.z += 0.005;
    }

    //

    setPreviousPosition(prevX, prevY, prevZ) {
        this.prevPosition = new Vector3(prevX, prevY, prevZ);
    }

    //

    updatePoint(delta, gravity) {

        if (!this.locked) {

            var vx = (this.position.x - this.prevPosition.x) * CONFIG.simulation.friction;
            var vy = (this.position.y - this.prevPosition.y) * CONFIG.simulation.friction;
            var vz = (this.position.z - this.prevPosition.z) * CONFIG.simulation.friction;

            this.prevPosition.x = this.position.x;
            this.prevPosition.y = this.position.y;
            this.prevPosition.z = this.position.z;

            this.position.x += vx; 
            this.position.y += vy;
            this.position.z += vz;

            var g = gravity;
            g /= CONFIG.simulation.timeStep;

            this.position.y += g * delta;

            var w = CONFIG.simulation.wind;

            this.position.z += w * delta;

        }

    }

    //

    constrainPoint(sceneW, sceneH) {

        if (!this.locked) {

            var vx = (this.position.x - this.prevPosition.x) * CONFIG.simulation.friction;
            var vy = (this.position.y - this.prevPosition.y) * CONFIG.simulation.friction;

            if (this.position.x > sceneW / 2) {
                this.position.x = sceneW / 2;
                this.prevPosition.x = this.position.x + vx * CONFIG.simulation.bounce;
            }
            else if (this.position.x < -sceneW / 2) {
                this.position.x = -sceneW / 2;
                this.prevPosition.x = this.position.x + vx * CONFIG.simulation.bounce;
            }

            if (this.position.y > sceneH / 2) {
                this.position.y = sceneH / 2;
                this.prevPosition.y = this.position.y + vy * CONFIG.simulation.bounce;
            }
            else if (this.position.y < -sceneH / 2) {
                this.position.y = -sceneH / 2;
                this.prevPosition.y = this.position.y + vy * CONFIG.simulation.bounce;
            }

        }

    }

    //

    toggleLocked() {
        
        this.locked = !this.locked;

        this.updateColor();
        
    }

    //

    updateColor() {

        if (this.locked) {
            this.defaultColor = CONFIG.cloth.lockedColor;
        }
        else {
            this.defaultColor = CONFIG.cloth.unlockedColor;
        }

    }
}
