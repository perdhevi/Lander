
import Universe from '../Universe';
import { Experience } from "../Experience";
//import * as THREE from 'three';
import EventEmitter from '../utils/EventEmitterTS';
let inputInstance: Inputs | undefined = undefined;
export default class Inputs extends EventEmitter {
    experience!: Experience;
    univ!:Universe;
    constructor(){
        if(inputInstance){
            return inputInstance;
        }
        super();
        inputInstance = this;
        this.univ = new Universe();
        this.experience = new Experience();
    }
    setupListener() {
        window.addEventListener('keydown', (evt) => {
            //console.log('keydown', evt.code);
            if(this.univ.animating) return; 
            switch (evt.code) {
                case "KeyW":
                    this.univ.moveState[0] = 1;
                    break;
                case "KeyD":
                    this.univ.moveState[1] = 1;
                    break;
                case "KeyS":
                    this.univ.moveState[2] = 1;
                    break;
                case "KeyA":
                    this.univ.moveState[3] = 1;
                    break;
            }
            if (this.univ.moveState.includes(1))
                if(!this.univ.carrying){
                    this.univ.setAction(1);
                }else{
                    this.univ.setAction(4);
                }
        });

        window.addEventListener('keyup', (evt) => {
            //console.log('keyup', evt.code);
            if(this.univ.animating) return; 
            switch (evt.code) {
                case "KeyW":
                    this.univ.moveState[0] = 0;
                    break;
                case "KeyD":
                    this.univ.moveState[1] = 0;
                    break;
                case "KeyS":
                    this.univ.moveState[2] = 0;
                    break;
                case "KeyA":
                    this.univ.moveState[3] = 0;
                    break;
                case "KeyQ":
                    this.univ.moveCameraLeft();
                    break;
                case "KeyE":
                    this.univ.moveCameraRight();
                    break;
                case "KeyX":
                    //console.log("Spacebar hit")
                    this.handleSpacebarKeyUp(evt);
                    break;
            }
            if ((!this.univ.moveState.includes(1)) && (evt.code != "KeyQ") && (evt.code != "KeyE") && (evt.code != "KeyX"))
            if(!this.univ.carrying){
                this.univ.setAction(0);
            }else{
                this.univ.setAction(3);
            }            
            
        });

        if (this.experience.canvas) {
            this.experience.canvas.addEventListener('mousedown', this.handleClickStart);
            this.experience.canvas.addEventListener('mouseup', this.handleClickEnd);
            this.experience.canvas.addEventListener('mousemove', this.handleclickMove);

            this.experience.canvas.addEventListener('touchstart', this.handleTouchStart);
            this.experience.canvas.addEventListener('touchend', this.handleTouchEnd);
            this.experience.canvas.addEventListener('touchmove', this.handleTouchMove);
        }

        if(this.univ.controlHud){
            this.univ.controlHud.addEventListener('mouseup', this.handleHUDClickEnd);
            this.univ.controlHud.addEventListener('touchend', this.handleHUDTouchEnd);
        }

    }
    
    
    handleSpacebarKeyUp(evt:KeyboardEvent){
        this.univ.handlePickup();
    }

    handleHUDClickEnd(evt:MouseEvent){
        evt.preventDefault();
        (new Universe).handleHUDAct(evt.x, evt.y);
    }
    handleHUDTouchEnd(evt:TouchEvent){
        evt.preventDefault();
        if (evt.changedTouches[0])
            (new Universe).handleHUDAct(evt.changedTouches[0].clientX, evt.changedTouches[0].clientY)
    }

    handleClickStart(evt: MouseEvent) {
        evt.preventDefault();
        (new Universe).handleActStart(evt.x, evt.y);
    }
    handleclickMove(evt: MouseEvent) {
        evt.preventDefault();
        (new Universe).handleActMove(evt.x, evt.y);
    }
    handleClickEnd(evt: MouseEvent) {
        evt.preventDefault();
        (new Universe).handleActEnd();
    }

    handleTouchStart(evt: TouchEvent) {
        evt.preventDefault();
        if (evt.changedTouches[0])
            (new Universe).handleActStart(evt.changedTouches[0].clientX, evt.changedTouches[0].clientY)
    }
    handleTouchEnd(evt: TouchEvent) {
        evt.preventDefault();
        (new Universe).handleActEnd();
    }
    handleTouchMove(evt: TouchEvent) {
        evt.preventDefault();
        if (evt.changedTouches[0])
            (new Universe).handleActMove(evt.changedTouches[0].clientX, evt.changedTouches[0].clientY)

    }
}