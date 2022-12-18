import {
    Texture as THREE_Texture,
    BoxGeometry as THREE_BoxGeometry,
    MeshBasicMaterial as THREE_MeshBasicMaterial,
    Group as THREE_Group,
    SphereGeometry  as THREE_SphereGeometry,
    MeshStandardMaterial as THREE_MeshStandardMaterial,
    Mesh as THREE_Mesh,
    TextureLoader as THREE_TextureLoader,
    Points as THREE_Points,
    Vector3 as THREE_Vector3,
    Scene as THREE_Scene,
    HemisphereLight as THREE_HemisphereLight,
    PointLight as    THREE_PointLight,
    BufferGeometry as THREE_BufferGeometry,
    BufferAttribute  as THREE_BufferAttribute,
    PointsMaterial as THREE_PointsMaterial,
    Material as THREE_Material
    } 
from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import keyboardFBXURL from './models/keyboard.dat?url';
import shipFBXURL from './models/objects/escape-world.dat?url';
import { Experience } from "./Experience";
import TextureURL from './images/planet_barren_Base_Color.jpg';
import TextureNormalURL from './images/planet_barren_Normal_OpenGL.jpg';
import TextureRoughnessURL from './images/planet_barren_Roughness.jpg';
import Size from './utils/Sizes';
import * as pako from 'pako';

export default class World {
    experience: Experience;

    frontCurtain:HTMLCanvasElement | undefined;
    curtainOpacity : number = 0;

    switchUp: boolean = false;
    animationState: number = 0;
    textOpacity: number = 1;
    texture!: THREE_Texture;
    screenAdd: number = 0;
    phaseTime: number = 0;

    //may need to split this to a new class Actor
    geometry!: THREE_BoxGeometry;
    material!: THREE_MeshBasicMaterial;
    keyboard!: THREE_Group;
    ship!:THREE_Group;

    planetGeometry!: THREE_SphereGeometry;
    planetMaterial!: THREE_MeshStandardMaterial;
    planet!: THREE_Mesh;

    textureLoader = new THREE_TextureLoader();
    planetColor!: THREE_Texture;
    planetNormal!: THREE_Texture;
    planetRoughness!: THREE_Texture;

    particle!: THREE_Points;

    lookPosition!: THREE_Vector3;
    lerpAlpha: number = 0.0001;

    scene!: THREE_Scene;

    hemiLight! : THREE_HemisphereLight;
    pointLight! : THREE_PointLight;
    constructor() {
        //super();
        this.experience = new Experience();
        const size = new Size();
        size.heightCalc = this.heightCalc;
        this.setup();
    }

    setup() {
        //super.setup();
        this.scene = new THREE_Scene();
        this.hemiLight = new THREE_HemisphereLight(0xffffff, 0x444444);
        this.hemiLight.position.set(0, 0, 0);
        this.scene.add(this.hemiLight);

        this.pointLight = new THREE_PointLight(0xFFFFFF,0.01,0);
        this.scene.add(this.pointLight);

        this.planetGeometry = new THREE_SphereGeometry(15, 32, 32);

        this.planetColor = this.textureLoader.load(TextureURL);
        this.planetNormal = this.textureLoader.load(TextureNormalURL);
        this.planetRoughness = this.textureLoader.load(TextureRoughnessURL);
        this.planetMaterial = new THREE_MeshStandardMaterial({ map: this.planetColor, roughnessMap: this.planetRoughness, normalMap: this.planetNormal });
        this.planet = new THREE_Mesh(this.planetGeometry, this.planetMaterial);
        this.planet.position.z = 200;
        this.planet.position.x = 200;

        this.scene.add(this.planet);



        const loader = new FBXLoader();

        //loader.load(keyboardFBXURL, (object) => {
            fetch(keyboardFBXURL).then( response => response.arrayBuffer() )
            .then(data => {
                //const res = (new Resources);
                //console.log(path)
                let binary = pako.inflate(data);
                let object = (loader.parse(binary.buffer, ''));

            object.position.x = 0.25;
            object.position.y = 0;
            object.position.z = -0.0;
            object.rotation.x = 1.57;
            object.rotation.y = 3.14;

            object.scale.set(0.05, 0.05, 0.05);
            this.keyboard = object;
            this.scene.add(this.keyboard);
        })

        //loader.load(shipFBXURL, (object) => {
        fetch(shipFBXURL)
        .then( response => {
                
                return response.arrayBuffer()
        })
        .then(data => {
            console.log('loading', shipFBXURL);
            let binary = pako.inflate(data);
            let object = (loader.parse(binary.buffer, ''));    
            object.scale.set(0.01, 0.01, 0.01);
            this.ship = object;

        })

        console.log('Done Setup');
        // console.log(this);

    }

    cleanup() {
        //console.log(this.keyboard);

        this.scene.remove(this.planet);
        this.scene.remove(this.keyboard);
        this.scene.remove(this.ship);
        this.scene.remove(this.particle);
        this.scene.remove(this.experience.camera.instance);

        this.planetGeometry.dispose();
        this.planetColor.dispose();
        this.planetNormal.dispose();
        this.planetRoughness.dispose();
        this.planetMaterial.dispose();
        this.cleanFBX(this.keyboard);
        this.cleanFBX(this.ship);
       
    }

    cleanFBX(g : THREE_Group){
        g.children.forEach((val) => {
            if(typeof val == typeof THREE_Mesh){
                let v = (<THREE_Mesh>val);
                v.geometry.dispose();
                if(typeof v.material == typeof THREE_Material)
                    (<THREE_Material>v.material).dispose();
                else
                if(typeof v.material == typeof Array){
                    (<Array<THREE_Material>>v.material).forEach((m=>{
                        m.dispose();
                    }))
                }

                }});
    }

    update() {
        //super.update();
        if(!this.keyboard) return;
        if (this.animationState == 0) return;
        const delta = this.experience.time.delta;
        if ((this.animationState >= 1) && (this.animationState <= 4)) {
            this.keyboard.position.z -= 0.001 * delta;
            this.keyboard.rotation.x += -delta * 0.002;

            this.lerpAlpha += 0.001;
        }
        switch (this.animationState) {
            case 1:
                if (this.keyboard.position.z < -1) {
                    this.animationState++;
                }
                break;
            case 2:
                this.textOpacity -= delta * 0.001;
                if (this.textOpacity <= 0) {
                    this.animationState++;
                }
                this.hideReactApp();

                break;
            case 3:
                //console.log(sizes.height);
                this.screenAdd += delta * 0.05;
                this.experience.sizes.height = window.innerHeight * 0.5 + this.screenAdd;

                if (this.experience.sizes.height > window.innerHeight - 5) {
                    this.experience.sizes.height = window.innerHeight - 5;
                    this.animationState++;
                    this.phaseTime = this.experience.time.elapsed;
                    this.experience.camera.resize();
                    this.experience.renderer.resize();
                }
                this.experience.renderer.resize();
                break;
            case 4:
                this.keyboard.position.z -= 0.01 * delta;

                if (this.experience.time.elapsed - this.phaseTime >= -300) {
                    this.animationState++;
                    this.lookPosition = new THREE_Vector3(0, 0, -100);
                    this.experience.camera.instance.lookAt(this.lookPosition);
                }
                break;
            case 5:
                this.lerpAlpha += delta * 0.01;
                this.lookPosition.lerp(this.planet.position, 0.01);
                this.experience.camera.instance.lookAt(this.lookPosition);
                this.planet.rotation.y += delta * 0.0001;
                if (this.lookPosition.distanceTo(this.planet.position) < 10) {
                    this.experience.camera.instance.lookAt(this.planet.position);
                    this.animationState++;
                    this.scene.add(this.ship);
                    this.ship.position.x = this.experience.camera.instance.position.x-10;
                    this.ship.position.y = this.experience.camera.instance.position.y+10;
                    this.ship.position.z = this.experience.camera.instance.position.z+20;
                }
                break;
            case 6:
                this.experience.camera.instance.lookAt(this.planet.position);
                this.experience.camera.instance.position.lerp(this.planet.position, 0.003);
                this.ship.position.lerp(this.planet.position, 0.0035);
                this.ship.rotation.x += delta * 0.005;
                this.ship.rotation.y += delta * 0.005;
                ///this.ship.rotation.z += delta * 0.005;
                this.planet.rotation.y += delta * 0.0001;
                if (this.experience.camera.instance.position.distanceTo(this.planet.position) < 30){
                    this.animationState++;
                    this.setFrontCurtain();
                }
                break;
            case 7:
                
                this.curtainOpacity += (delta * 0.0005);
                //console.log('opacity',this.curtainOpacity)                
                this.setCurtainOpacity(this.curtainOpacity);
                if(this.curtainOpacity>=1){
                    this.animationState++;
                }
                break;
            case 8:
                this.cleanup();
                this.experience.worldState++;
                break;
            default:
        }
    }

    setFrontCurtain(){
        this.frontCurtain = document.querySelector<HTMLCanvasElement>('canvas.frontCurtain') ?? undefined;
        //console.log(this.frontCurtain);
        if(this.frontCurtain){
            this.frontCurtain.style.top = "0px";
            this.frontCurtain.style.left = "0px";
            this.frontCurtain.style.width = window.innerWidth.toString() + "px";
            this.frontCurtain.style.height = window.innerHeight.toString() + "px";
            let ctx = this.frontCurtain.getContext("2d")
            //console.log(ctx);
            if(ctx){
                ctx.fillStyle = "#080808";
                ctx.beginPath();
                ctx.fillRect(0,0, window.innerWidth, window.innerHeight);
                ctx.stroke();
            }
            this.frontCurtain.style.visibility = "visible"
            this.setCurtainOpacity(0);
        }            
    }

    setCurtainOpacity(n:number){
        if(this.frontCurtain){
        this.frontCurtain.style.opacity = n.toString();
        }
    }

    //custom method area
    setRenderWindowSize(width: number, height: number) {

        this.experience.camera.instance.aspect = window.innerWidth / window.innerHeight;
        if(this.animationState>0)
            this.experience.camera.instance.updateProjectionMatrix();
        this.experience.renderer.instance.setSize(width, height);

    }

    heightCalc() {
        if (this.animationState < 3){
// get proportion = outerHeight/outerWidth
            let proportion = window.outerHeight / window.outerWidth;
            //console.log('proportion', proportion);
// get innerWidth
            let w = window.outerWidth;
// set height = innerWidth * proportion            
// and height = height *0.5 + this.screenAdd
            let h = w * proportion * 0.5 + this.screenAdd;

            //console.log('calc height',h);
            return h;
        }else{
            return window.innerHeight;
        }
    }

    hideReactApp() {
        const reactApp: HTMLElement | null = document.getElementById('root');
        if (reactApp)
            switch (this.animationState) {
                case 2:
                    reactApp.style.opacity = String(this.textOpacity);
                    break;
                case 3:
                    reactApp.hidden = true;
            }
    }

    createStars() {
        const particleGeometry = new THREE_BufferGeometry();
        const count = 1000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 1000;
        }
        particleGeometry.setAttribute('position', new THREE_BufferAttribute(positions, 3));
        const particleMaterial = new THREE_PointsMaterial({
            size: 1,
            sizeAttenuation: true
        });
        this.particle = new THREE_Points(particleGeometry, particleMaterial);
        this.scene.add(this.particle);
    }


}
