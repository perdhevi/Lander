declare global {
  interface Window { experience: Experience; }
}
import Size from './utils/Sizes';
import Time from './utils/Time';
import {Scene as THREE_Scene }  from 'three';
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World';
import Universe from './Universe';

// import UniverseURL from './Universe.ts?url';
let instance: Experience | undefined = undefined;

export class Experience {
  self!: Experience;
  canvas?: HTMLCanvasElement;
  sizes: Size = new Size();
  time: Time = new Time();
  scene!: THREE_Scene;
  camera!: Camera;
  renderer!: Renderer;
  world!: World;
//  universe!: Universe;
  universe!: any;
  worldState: number = 0;

  constructor(_canvas?: HTMLCanvasElement) {
    if (instance) {
      return instance;
    }
    instance = this;
    //console.log('window size:', window.innerWidth, 'x', window.innerHeight);
    this.self = this;
    this.world = new World();
    this.scene = this.world.scene;


    this.canvas = _canvas;
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight * 0.5;
    //console.log('initial window calculated ', this.sizes.width , ' x ', this.sizes.height);
    this.camera = new Camera();
    this.camera.enableProjectionRecalc = false;
    this.renderer = new Renderer();
    this.sizes.heightCalc = this.world.heightCalc;

    this.setup();
  }

  setup() {
    this.sizes.on('resize', () => {
      this.resize();
    });
    this.time.on('tick', () => {
      this.update();
    })

    //Custom hack
    if (this.canvas) {
      this.canvas.addEventListener('click', () => {
        if (this.world.animationState == 0) {
          this.sizes.halfHeightMode = false;
          this.camera.resize();
          this.renderer.resize();
          this.world.createStars();
          this.world.animationState = 1;
          this.world.switchUp = !this.world.switchUp;
          this.time.reset();
        }
      }
      )
    }
  }
  loadUniverse() {
    // import('./Universe').then((Universe) => {
    //   this.universe = new Universe.();
    //   this.universe.loadResources();  
    //   this.worldState++;

    // });
    this.universe = new Universe();
    this.universe.loadResources();  
    this.worldState++;


  }

  resize() {
    // console.log('resize Occured');
    if (this.worldState > -1) {
      this.camera.enableProjectionRecalc = true;
      this.camera.resize();
      this.renderer.resize();
    } else {
      if (this.canvas) {
        //this.canvas.width = window.innerWidth;
        this.renderer.resize();
        // console.log(this.canvas.width);
      }
    }
    if(this.worldState == 3){
      this.universe.resizeHUD();
    }
  }

  update() {
    switch (this.worldState) {
      case 0:
        this.world.update();
        break;
      case 1:
        this.loadUniverse();
        break;
      case 2:
        this.universe.drawLoading();
        break;
      case 3:
        this.universe.update();
        break;
    }
    this.camera.update();
    this.renderer.update();

  }


}
