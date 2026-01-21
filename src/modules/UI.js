import { Pane } from 'tweakpane';
import { CONFIG } from '../Config.js';

export class UI {
    constructor(app) {
        this.app = app;
        this.init();
    }

    init() {
        this.pane = new Pane({ title: 'Configuration' });

        this.addToPane(this.pane, CONFIG);

        this.pane.addButton({ title: 'Restart Simulation' }).on('click', () => {
            if (this.app.shapes) {
                this.app.shapes.restart();
            }
            if (this.app.helpers) {
                this.app.helpers.resetControls();
            }
        });
    }

    addToPane(folder, obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                const subFolder = folder.addFolder({ title: key });
                this.addToPane(subFolder, obj[key]);
            } else {
                folder.addBinding(obj, key).on('change', (ev) => {
                    this.handleConfigChange(key, ev.value);
                });
            }
        }
    }

    handleConfigChange(key, value) {
        // Trigger updates in modules
        switch(key) {
            case 'width':
            case 'height':
                // Requires explicit restart usually, maybe hint user?
                break;
            case 'scale':
            case 'color':
                if (this.app.shapes) this.app.shapes.updateFromConfig();
                break;
            case 'exposure':
                if (this.app.renderer) this.app.renderer.toneMappingExposure = value;
                break;
            case 'hemiSkyColor':
            case 'hemiGroundColor':
            case 'hemiIntensity':
            case 'spotColor':
            case 'spotIntensity':
            case 'spotShadowBias':
                if (this.app.lights) this.app.lights.updateFromConfig();
                break;
            case 'showAxes':
            case 'showSpotLightHelper':
                if (this.app.gizmos) this.app.gizmos.update();
                break;
        }
    }
}
