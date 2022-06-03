import * as THREE from 'three';
import { Experience } from './Experience';
import Size from './utils/Sizes';

export default class Camera {
    experience: Experience;
    sizes: Size;
    scene: THREE.Scene;
    canvas?: HTMLCanvasElement;
    instance: THREE.PerspectiveCamera;
    enableProjectionRecalc: boolean = false;

    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.instance = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.02);
        this.setup();
    }

    setup() {
        this.instance.position.z = 0.4;
        this.scene.add(this.instance);
        this.resize();
    }

    resize() {
        //console.log('camera before - ', this.instance.aspect);
        this.instance.aspect = this.sizes.width / this.sizes.height;
        //console.log('camera after - ', this.instance.aspect);
        //if (this.enableProjectionRecalc)
        this.instance.updateProjectionMatrix();
        //renderer.setSize(width, height);

    }

    update() {

    }

}