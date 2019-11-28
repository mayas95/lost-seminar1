import Application from '../common/Application.js';

import Renderer from './Renderer.js';
import Physics from './Physics.js';
import Camera from './Camera.js';
import Light from './Light.js';
import SceneLoader from './SceneLoader.js';
import SceneBuilder from './SceneBuilder.js';

class App extends Application {

    start() {
        const gl = this.gl;

        this.renderer = new Renderer(gl);
        this.time = Date.now();
        this.startTime = this.time;
        this.aspect = 1;

        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);

        this.load('scene.json');
    }

    endGameSuccess() {
        this.camera.disable();
        document.getElementById('winning').classList.remove('hide');
    }
    endGameFail() {
        this.camera.disable();
        document.getElementById('ending').classList.remove('hide');
    }

    async load(uri) {
        const scene = await new SceneLoader().loadScene('scene.json');
        const builder = new SceneBuilder(scene);
        this.scene = builder.build();
        this.physics = new Physics(this.scene, 0, false);

        // Find first camera.
        this.camera = null;
        this.scene.traverse(node => {
            if (node instanceof Camera) {
                this.camera = node;
            } else if (node instanceof Light) {
              this.light = node;
            }
        });

        this.camera.aspect = this.aspect;
        // this.camera.enable();
        // this.enableCamera();
        this.camera.updateProjection();
        this.renderer.prepare(this.scene);
    }

    enableCamera() {
        // console.log('enableCamera');
        this.canvas.requestPointerLock();
    }

    pointerlockchangeHandler() {
        // console.log('handler');
        if (!this.camera) {
            return;
        }
        // console.log('document.pointerLockElement: ', document.pointerLockElement);
        if (document.pointerLockElement === this.canvas) {
            this.camera.enable();
        } else {
            this.camera.disable();
        }
    }

    update() {
        const t = this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;

        if (this.camera) {
            this.camera.update(dt);
        }

        if (this.physics) {
            if (this.physics.counter === 3) {
              this.endGameSuccess();
            }
            if (this.physics.die) {
              this.endGameFail();
            }
            this.physics.update(dt);
        }
    }

    render() {
        if (this.scene) {
            this.renderer.render(this.scene, this.camera, this.light);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        this.aspect = w / h;
        if (this.camera) {
            this.camera.aspect = this.aspect;
            this.camera.updateProjection();
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const app = new App(canvas);
    const gui = new dat.GUI();
    gui.add(app, 'enableCamera');
    // console.log('canvas: ', canvas);
    // console.log('gui', gui);
});
