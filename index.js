import { App } from './src/core/App.js';

require('normalize.css/normalize.css');
require("./src/index.css");

// Initialize Application
window.onload = function () {
    new App();
};
