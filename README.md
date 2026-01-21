# Cloth 🧵
![Cloth](https://user-images.githubusercontent.com/48356710/141651772-816a9ef2-d251-4869-87bc-cd3fcadfbb63.png)


## Live Demo
- https://robertolovece.github.io/Cloth/

## Overview

My second piece of work using Verlet integration I wanted to expand my first demo (https://github.com/RobertoLovece/Rope-Grid) into a 3D domain to create a fully fledged cloth simulation.

## Instructions

- Tap on the screen to reverse the current direction of gravity.

## Installation
__Requires npm (https://www.npmjs.com/)__

- __Install__ - npm i

- __Run__ - npm run start

## Usage (CDN)

You can import this project directly using a CDN. Make sure to set up an import map for `three` as shown below.

1. Create an `index.html` file with the following content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Cloth Demo</title>
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.module.min.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.182.0/examples/jsm/"
}}</script>
</head>
<body>
<!-- Your content here -->
<script type="module">
import { initInstanceObjects } from 'https://cdn.jsdelivr.net/gh/RobertoLovece/Cloth@latest/dist/index.bundle.min.js';
// Note: The original project structure might not export everything by default.
// Adjust the import path according to where the build artifacts are hosted.
</script>
</body>
</html>
```

*Note: The CDN URL `https://cdn.jsdelivr.net/gh/RobertoLovece/Cloth@latest/` refers to the `latest` version of the repository.*
