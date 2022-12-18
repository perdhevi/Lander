

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import EventEmitter from '../utils/EventEmitterTS';


import astronautFBXRaw from '../models/astronaut/raw.dat?url';  //Base mesh
import astronautFBXIdle from '../models/astronaut/idle.dat?url'; //0: move idle
import astronautFBXStandardRun from '../models/astronaut/running.dat?url';  //1: running around
import astronautFBXKneel from '../models/astronaut/kneel.dat?url'; // 2: kneeling down
import astronautFBXidleCarry from '../models/astronaut/idleCarry.dat?url';  //3:Idle Cary 
import astronautFBXrunCarry from '../models/astronaut/runCarry.dat?url'; //  //4: Running Carry

import cliff_dry from '../models/surface/cliff_dry.dat?url';
import cliffd_dry from '../models/surface/cliffd_dry.dat?url';
import color_swatch from '../models/surface/color_swatch.png?url';
import cliff2a_drydFBXRaw from '../models/surface/cliff2a_dry.dat?url';
import cliff2b_drydFBXRaw from '../models/surface/cliff2b_dry.dat?url';
import crystal_large from '../models/surface/crystal_large.dat?url';
import crystal_tall from '../models/surface/tall_crystal.dat?url';
import tall_rock_dry from '../models/surface/tall_rock_dry.dat?url';
import tall_rockb_dry from '../models/surface/tall_rockb_dry.dat?url';

import plant1 from '../models/surface/lush_bulbous_plant.dat?url';
import grass1 from '../models/surface/dry_grass.dat?url';
import grass2 from '../models/surface/dry_plant.dat?url';
import grass3 from '../models/surface/dry_tall_plant.dat?url';
import grass4 from '../models/surface/lush_grassB.dat?url';

import crate from '../models/objects/crate.dat?url';
import antena from '../models/objects/antena.dat?url';
import pod from '../models/objects/escape.dat?url';

import Universe from '../Universe';

import * as THREE from 'three';
import {
    Group as THREE_Group,
    TextureLoader as THREE_TextureLoader,
    Texture as THREE_Texture,
    MeshStandardMaterial as THREE_MeshStandardMaterial,
    BoxGeometry as THREE_BoxGeometry,
    Material as THREE_Material,
    AnimationMixer as THREE_AnimationMixer,
    Object3D as THREE_Object3D,
    Mesh as THREE_Mesh,
    MeshBasicMaterial as THREE_MeshBasicMaterial
} from 'three'
import * as pako from 'pako';

let resourceInstance: Resources | undefined = undefined;

enum EnvironmentType {
    cliff,
    plant,
    object
}

type ObjectLoaded = (object : THREE_Group) => void;

export class RocksModel extends THREE_Group {
    width: number = 0;
    height: number = 0;
    constructor() {
        super();

    }
}

export default class Resources extends EventEmitter {
    loadedObject: number = 0;
    totalObject: number = 23;

    objectScale: number = 5;

    loader = new FBXLoader();
    textureLoader = new THREE_TextureLoader();
    environmentTexture!: THREE_Texture;
    environmentMaterial!: THREE_MeshStandardMaterial;

    cliff: RocksModel[] = [];
    plant: THREE_Group[] = [];

    objects: THREE_Group[] = [];

    crateGeometry! : THREE_BoxGeometry;
    crateMaterial! : THREE_Material;

    constructor() {
        if (resourceInstance) {
            return resourceInstance;
        }
        super();

        resourceInstance = this;


    }

    load() {
        this.loadAstronaut();
        this.loadObjects();
        this.loadEnvironment();
    }

    // loadAstronautAnimation(name:string, index:number){
    //     this.loader.load(astronautFBXIdle, (object) => {
    //         const res = (new Resources);
    //         let universe = new Universe();
    //         const animationAction = universe.mixer.clipAction(
    //             (object as THREE_Object3D).animations[0]
    //         )
    //         universe.astronaut.animations.splice(index,0,(object.animations[0]));
    //         universe.animationActions.splice(index,0,(animationAction));
    //         res.progressStatus();
    //     });
    // }
    
    loadUsingPako(path: RequestInfo, onLoad:ObjectLoaded) {
        fetch(path).then( response => response.arrayBuffer() )
        .then(data => {
            const res = (new Resources);
            console.log(path)
            let binary = pako.inflate(data);
            let object = (res.loader.parse(binary.buffer, ''));
            onLoad.call(this, object);
        })
    }

    loadAstronaut() {
        this.loadUsingPako(astronautFBXRaw, (object) => {
            object.scale.set(0.1, 0.1, 0.1);
            //object.castShadow=true;
            let universe = new Universe();
            universe.astronaut = object;
            //universe.astronaut.castShadow = true;
            universe.mixer = new THREE_AnimationMixer(object);
            const res = (new Resources);
            res.progressStatus();
            // res.loadAstronautAnimation(astronautFBXIdle, 0);
            // res.loadAstronautAnimation(astronautFBXStandardRun, 1);
            // res.loadAstronautAnimation(astronautFBXKneel, 2);
            // res.loadAstronautAnimation(astronautFBXidleCarry, 3);
            // res.loadAstronautAnimation(astronautFBXrunCarry, 4);

            this.loadUsingPako(astronautFBXIdle, (object) => {
                const res = (new Resources);
                const animationAction = universe.mixer.clipAction(
                    (object as THREE_Object3D).animations[0]
                )
                universe.astronaut.animations.push(object.animations[0]);
                universe.animationActions.push(animationAction);
                res.progressStatus();

                this.loadUsingPako(astronautFBXStandardRun, (object) => {
                    const res = (new Resources);
                    const animationAction = universe.mixer.clipAction(
                        (object as THREE_Object3D).animations[0]
                    )
                    universe.astronaut.animations.push(object.animations[0]);
                    universe.animationActions.push(animationAction);
                    res.progressStatus();

                    this.loadUsingPako(astronautFBXKneel, (object) => {
                        const animationAction = universe.mixer.clipAction(
                            (object as THREE_Object3D).animations[0]
                        )
                        universe.astronaut.animations.push(object.animations[0]);
                        universe.animationActions.push(animationAction);
                        res.progressStatus();
                        this.loadUsingPako(astronautFBXidleCarry, (object) => {
                            const animationAction = universe.mixer.clipAction(
                                (object as THREE_Object3D).animations[0]
                            )
                            universe.astronaut.animations.push(object.animations[0]);
                            universe.animationActions.push(animationAction);
                            res.progressStatus();

                            this.loadUsingPako(astronautFBXrunCarry, (object) => {
                                const animationAction = universe.mixer.clipAction(
                                    (object as THREE_Object3D).animations[0]
                                )
                                universe.astronaut.animations.push(object.animations[0]);
                                universe.animationActions.push(animationAction);
                                res.progressStatus();                
                            });
                        });
                    });
                });
            });
        });        
    }

    loadEnvObject(path: string, type: EnvironmentType, target: number, name: string = "", 
        xCorrection:number = 0, yCorrection : number =0, zCorrection : number = 0,scale:number = this.objectScale) {
        const res = (new Resources());
        
        this.loadUsingPako(path, (object) => {
            let child = <THREE_Mesh>(object.children[0]);
            if((type == EnvironmentType.cliff)||(type == EnvironmentType.plant)){
                child.material = res.environmentMaterial.clone();
            };
            if (name != "") {
                object.children.forEach(element => {
                    element.name = name;
                });
                object.name = name;
            };

            child.position.x = xCorrection;
            child.position.y = yCorrection;
            child.position.z = zCorrection;
            object.scale.setScalar(scale);
            switch (type) {
                case EnvironmentType.cliff:
                    res.cliff[target] = <RocksModel>object;

                    break;
                case EnvironmentType.plant:
                    res.plant[target] = object
                    break;

                case EnvironmentType.object:
                    res.objects[target] = object;
                    break;
            }
            res.progressStatus();
        })         
    }

    loadEnvironment() {
        console.log('load Environment');
        this.textureLoader.load(color_swatch, (texture) => {
            const res = (new Resources());
            res.environmentTexture = texture;
            res.environmentMaterial = new THREE_MeshStandardMaterial({ map: texture });
            //res.environmentMaterial.transparent= true;
            res.environmentMaterial.opacity = 1;
            (new Resources).progressStatus();

            //cliffs
            //big wall
            res.loadEnvObject(cliff2a_drydFBXRaw, EnvironmentType.cliff, 0);
            res.loadEnvObject(cliff2b_drydFBXRaw, EnvironmentType.cliff, 1);

            res.loadEnvObject(crystal_large, EnvironmentType.cliff, 2);  //0
            res.loadEnvObject(tall_rock_dry, EnvironmentType.cliff, 3);  //1
            res.loadEnvObject(tall_rockb_dry, EnvironmentType.cliff, 4, "", 0, 0, -0.6);  //2
            res.loadEnvObject(crystal_tall, EnvironmentType.cliff, 5);  //3
            res.loadEnvObject(cliff_dry, EnvironmentType.cliff, 6, "",0,0,-0.5);  //4
            res.loadEnvObject(cliffd_dry, EnvironmentType.cliff, 7, "", 0.5,0,0);  //5

            //plants
            res.loadEnvObject(plant1, EnvironmentType.plant, 0, 'grass0');
            res.loadEnvObject(grass1, EnvironmentType.plant, 1, 'grass1');
            res.loadEnvObject(grass2, EnvironmentType.plant, 2, 'grass2');
            res.loadEnvObject(grass3, EnvironmentType.plant, 3, 'grass3');
            res.loadEnvObject(grass4, EnvironmentType.plant, 4, 'grass4');

        })
    }

    loadObjects(){
        const res = (new Resources());
        res.loadEnvObject(crate, EnvironmentType.object, 0, 'crate',0,0,0, 0.07);
        res.loadEnvObject(antena, EnvironmentType.object, 1, 'antena',0,0,0, 0.07);
        res.loadEnvObject(pod, EnvironmentType.object, 2, 'escape',0,0,0, 0.07);
        
        this.crateGeometry = new THREE_BoxGeometry(4.5,5,4.5);
        this.crateMaterial = new THREE_MeshBasicMaterial({ color: 0x0000FF });
        let univ = (new Universe); 
        univ.crateCarried = new THREE_Group().add( new THREE_Mesh(this.crateGeometry, this.crateMaterial));
        univ.crateCarried.position.y = 1000;
        univ.scene.add(univ.crateCarried);
    }

    progressStatus() {
        this.loadedObject++;
        if (this.loadedObject == this.totalObject) {
            let universe = new Universe();
            universe.resourceStatus();
        }
    }

    getLoadingPercentage(){
        return this.loadedObject / this.totalObject;
    }

    unload() {

    }
}