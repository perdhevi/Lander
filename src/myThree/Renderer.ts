import * as THREE from 'three';
import { Experience } from './Experience';

export default class Renderer {
    experience: Experience;
    instance: THREE.WebGLRenderer;
    applyRender: boolean = true;
    constructor() {
        this.experience = new Experience();
        this.instance = new THREE.WebGLRenderer({
            canvas: this.experience.canvas
        })
        this.setup();
    }

    setup() {
        this.instance.setSize(this.experience.sizes.width, this.experience.sizes.height);
    }

    resize() {
        this.instance.setSize(this.experience.sizes.width, this.experience.sizes.height);
        this.instance.setPixelRatio(Math.min(this.experience.sizes.pixelRatio, 2))
    }

    update() {
        //console.log(this.experience.scene);
        if (this.applyRender)
            this.instance.render(this.experience.scene, this.experience.camera.instance);
    }
}