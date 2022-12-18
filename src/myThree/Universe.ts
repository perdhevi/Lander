import { Experience } from "./Experience";
import {
    Group as THREE_Group,
    MeshStandardMaterial as THREE_MeshStandardMaterial,
    Mesh as THREE_Mesh,
    Points as THREE_Points,
    Vector3 as THREE_Vector3,
    Scene as THREE_Scene,
    HemisphereLight as THREE_HemisphereLight,
    BufferGeometry as THREE_BufferGeometry,
    BufferAttribute  as THREE_BufferAttribute,
    PointsMaterial as THREE_PointsMaterial,
    Material as THREE_Material,
    AnimationAction as THREE_AnimationAction,
    AnimationMixer as THREE_AnimationMixer,
    Fog as THREE_Fog,
    Color as THREE_Color,
    EventListener as THREE_EventListener,
    Event as THREE_Event,
    DirectionalLight as THREE_DirectionalLight,
    Raycaster as THREE_Raycaster,
    MeshPhongMaterial as THREE_MeshPhongMaterial
} from 'three';


import { Vector2, Vector3 } from "three";
import Map, {Crate} from './Universe/Map';
import Resources from "./Universe/Resources";
import Inputs from "./Universe/Inputs";
import btnLeft from "./images/rotate-object-left.png";
import btnPick from "./images/pickup.png";
import btnRight from "./images/rotate-object-right.png";
import cast from "./images/cast.json";

let universeInstance: Universe | undefined = undefined;
export default class Universe {
    experience!: Experience;
    input!: Inputs;
    //Button & HUD elements
    mapWindow: HTMLCanvasElement | undefined;
    mapCompass: HTMLCanvasElement | undefined;
    controlHud: HTMLCanvasElement | undefined;
    messageHUD: HTMLDivElement | undefined;
    messageText: HTMLDivElement | undefined;
    frontCurtain: HTMLCanvasElement | undefined;
    frontCurtainOpacity : number = 0;
    messageDoneButton: HTMLButtonElement | undefined;
    hudContainer: HTMLDivElement | undefined;
    btnLeft : HTMLInputElement | undefined;
    btnRight : HTMLInputElement | undefined;
    btnPick : HTMLInputElement | undefined;

    handleMessageDone : ((n:number) => number) | undefined;

    loaded:boolean = false;
    gameState : number = 0;
    outroAnimation:number = 0;
    outroLookAt!:THREE_Vector3;
    outroCast: number =0;
    outroCastList:string[] = [];
    introAnimation: number = 0;
    scene!: THREE_Scene;
    astronaut!: THREE_Group;
    animationActions: THREE_AnimationAction[] = []
    mixer!: THREE_AnimationMixer;
    activeAction!: THREE_AnimationAction;
    lastAction!: THREE_AnimationAction;
    moveState = [0, 0, 0, 0];  //up, right, down, left
    mousePressed: boolean = false;
    mouseLastPost: Vector2 = new Vector2();
    lookatDegree: number = 0;
    target = new Vector2();
    cameraDegree: number = 0;
    cameraPositionDistance = 100;
    animating:boolean = false;

    clickDegree: number = 0;
    clickRegion: number = 1;
    resources: Resources = new Resources();;
    map!: Map;

    delivered : number = 0;

    //uncomment this to debug Astronaut Position <playerGrid>
    // rockGeometry!: THREE_BoxGeometry;
    // rockMaterial!: THREE_MeshBasicMaterial;
    // rock!: THREE_Mesh;

    fog!: THREE_Fog;

    particle!: THREE_Points;
    
    crateCarried!: THREE_Group;
    carrying : boolean = false;

    transparent: THREE_Material[] = [];

    constructor() {
        if (universeInstance) {
            return universeInstance;
        }
        universeInstance = this;

        this.experience = new Experience();
        this.input = new Inputs();
        this.setupDivs();

        this.setupFrontCurtain();
        this.setFrontCurtainLayout()
        this.setup();
    }

    setup() {
        this.scene = new THREE_Scene();
        this.scene.background = new THREE_Color(0x000044);

        //uncomment this to debug Astronaut Position <playerGrid>
        // this.rockGeometry = new THREE_BoxGeometry(10, 2, 10);
        // this.rockMaterial = new THREE_MeshBasicMaterial({ color: 0x0000FFF, side: THREE_DoubleSide });
        // this.rock = new THREE_Mesh(this.rockGeometry, this.rockMaterial);
        // this.scene.add(this.rock);
  
        this.resizeHUD();
        this.input.setupListener();

        //console.log('done universe - setup')
    }

    setupDivs(){
        this.mapCompass = document.querySelector<HTMLCanvasElement>('canvas.compass') ?? undefined
        this.mapWindow = document.querySelector<HTMLCanvasElement>('canvas.map') ?? undefined
        //this.controlHud = document.querySelector<HTMLCanvasElement>('canvas.hud') ?? undefined

        this.messageHUD = document.querySelector<HTMLDivElement>('div.msgWindow') ?? undefined
        this.messageText = document.querySelector<HTMLDivElement>('div.msgText') ?? undefined
        this.messageDoneButton = document.querySelector<HTMLButtonElement>('button.msgDone') ?? undefined
        if(this.messageDoneButton){
            this.messageDoneButton.addEventListener('mouseup', this.messageDone)
        }
        this.hudContainer = document.querySelector<HTMLDivElement>('div.hud-container') ?? undefined
        if(this.hudContainer){
            this.hudContainer.style.visibility = "hidden";

            this.btnLeft = <HTMLInputElement>document.getElementById('btnLeft') ?? undefined;
            if(this.btnLeft){
                this.btnLeft.src = btnLeft;
                this.btnLeft.innerText = "";
                this.btnLeft.onclick = (evt) =>{ (new Universe).moveCameraLeft() };                
            }
            this.btnPick = <HTMLInputElement>document.getElementById('btnPick') ?? undefined;
            if(this.btnPick){
                this.btnPick.src = btnPick;
                this.btnPick.innerText = "";    
                this.btnPick.onclick =  (evt) =>{ (new Universe).handlePickup() };                            
            }            
            this.btnRight = <HTMLInputElement>document.getElementById('btnRight') ?? undefined;
            if(this.btnRight){
                this.btnRight.src = btnRight;
                this.btnRight.innerText = "";                
                this.btnRight.onclick = (evt) =>{ (new Universe).moveCameraRight() };

            }            
        }
        this.resizeHUD();
        this.frontCurtain = document.querySelector<HTMLCanvasElement>('canvas.frontCurtain') ?? undefined

    }

    setHUDContainerVisible(show:boolean){
        if(this.hudContainer){
            this.hudContainer.style.visibility = show? "visible" : "hidden";
        }
    }

    setFrontCurtainLayout(){
        if(this.frontCurtain){
            // console.log('pixel ratio', window.devicePixelRatio);
            // console.log('sizes', this.experience.sizes)
            // console.log('window sizes', window.innerWidth, 'x',window.innerHeight);
            this.frontCurtain.width = this.experience.sizes.width ;//* window.devicePixelRatio;
            this.frontCurtain.height = this.experience.sizes.height ;//* window.devicePixelRatio;
            this.frontCurtain.style.width = this.experience.sizes.width + "px";
            this.frontCurtain.style.height = this.experience.sizes.height + "px";

        }
    }
    setupFrontCurtain(){
        if(this.frontCurtain){
           //this. setFrontCurtainLayout();
            this.frontCurtain.style.visibility = "visible"
            let ctx = this.frontCurtain.getContext("2d")
            //console.log(ctx);
            if(ctx){
                ctx.fillStyle = "#080808";
                ctx.beginPath();
                ctx.fillRect(0,0,this.frontCurtain.width, this.frontCurtain.height);
                ctx.stroke();
            
            }            
        }

    }
    hideFrontCurtain(){
        if(this.frontCurtain){
            this.frontCurtain.style.visibility = "hidden"
        }

    }

    setCurtainOpacity(n:number){
        if(this.frontCurtain){
        this.frontCurtain.style.opacity = n.toString();
        }
    }

    drawTitle(){
        if(this.frontCurtain){
            let ctx = this.frontCurtain.getContext("2d")
            //console.log(ctx);
            if(ctx){       
                let w = this.frontCurtain.width;
                let h = this.frontCurtain.height;

                let tPos =  h/2 - (h*0.25);
                ctx.fillStyle = "#FFFFFF";
                ctx.font = '48px Coming Soon';
                ctx.textAlign = "center";
                ctx.fillText("L a n d e d", w/2,tPos);
                ctx.font = '12px Coming Soon';
                ctx.fillText("by", w/2, tPos + 40);
                ctx.font = '16px Coming Soon';
                let mn = ['Z', 'i', 'l', 'q', '|', '\x81', 'i', '(', 'X', 'm', 'z', 'l', 'p', 'm', '~', 'q'];
                let m : string[] = [];
                mn.map((x)=> {m.push(String.fromCharCode(x.charCodeAt(0) - 8))})
                ctx.fillText(m.join(''), w/2, tPos + 64);
            }
        }
    }
    drawLoading(){
        //console.log('drawLoading');
        if(this.frontCurtain){
            let ctx = this.frontCurtain.getContext("2d")
            //console.log(ctx);
            if(ctx){
                let w = this.frontCurtain.width;
                let h = this.frontCurtain.height;

                this.drawTitle();

                ctx.beginPath();
                ctx.strokeStyle = "#808080";
                ctx.lineWidth = 6;
                ctx.rect( w /2 - (w * 0.2), h/2 + (h *0.1), (w*0.4), (h*0.1));
                ctx.stroke();    

                ctx.beginPath();
                ctx.fillStyle = "#F0F0F0";
                ctx.fillRect( w /2 - (w * 0.2), h/2 + (h *0.1), (w*0.4)  * this.resources.getLoadingPercentage(), (h*0.1));
                ctx.stroke();

                ctx.font = '24px Coming Soon';
                ctx.textAlign = "center";
                ctx.fillText("Loading", w/2, h/2 + (h*0.25));
                //console.log('loading', this.resources.getLoadingPercentage());
            }
            
        }
    }
    resizeHUD(){
        if(this.controlHud){
            const gameWidth = window.innerWidth;
            const gameHeight = window.innerHeight;
            //console.log(gameWidth , 'x', gameHeight);
            const hudWidth = ((gameWidth ?? 0) * 0.6);
            const hudHeight =  ((gameHeight ?? 0) *0.1);
            //console.log(hudWidth , 'x', hudHeight);

            if(hudWidth && hudHeight) {
                this.controlHud.style.width =  (hudWidth).toString() + "px";
                this.controlHud.style.height =  (hudHeight).toString() + "px";
    
                this.controlHud.style.top = ((gameHeight ?? 0) - hudHeight -(hudHeight*0.1)).toString() + "px";
                this.controlHud.style.left = (( (gameWidth ?? 0) /2) - (hudWidth/2)).toString() + "px";
            }
        }

        if(this.hudContainer){
            let sizeCalc = Math.min(this.experience.sizes.height, this.experience.sizes.width)
            let btnSize = (sizeCalc *0.1) + 'px';
            let btnSizei = (sizeCalc *0.1);
            this.hudContainer.style.top = (this.experience.sizes.height - btnSizei - 10) + 'px';
            this.hudContainer.style.height =  (btnSizei) + "px";
            this.hudContainer.style.width = this.experience.sizes.width + "px";
            
            if(this.btnLeft){
                this.btnLeft.style.width =  btnSize;
                this.btnLeft.style.height =  btnSize;
            }
            
            if(this.btnPick){
                this.btnPick.style.width =  btnSize;
                this.btnPick.style.height =  btnSize;
            }
            
            if(this.btnRight){
                this.btnRight.style.width =  btnSize;
                this.btnRight.style.height =  btnSize;
            }
        }        
    }

    drawHUD(){
        var ctx = this.controlHud?.getContext("2d");
        if((ctx)&&(this.controlHud)){
            ctx.fillStyle = "#0000FF";
            ctx.fillRect(0,0,this.controlHud?.width, this.controlHud?.height);
        }
    }

    moveCameraRight() {
        this.cameraDegree += Math.PI / 4;
        if (this.cameraDegree == Math.PI * 2)
            this.cameraDegree = 0;
    }
    moveCameraLeft() {
        this.cameraDegree -= Math.PI / 4;
        if (this.cameraDegree == - Math.PI * 2)
            this.cameraDegree = 0;
    }

    handleActStart(x: number, y: number) {
        if(this.animating) return; 
        this.mousePressed = true;
        this.mouseLastPost.x = x;
        this.mouseLastPost.y = y;
        if(!this.carrying){
            this.setAction(1);
        }else{
            this.setAction(4);
        }
    }
    handleActEnd() {
        if(this.animating) return; 
        this.mousePressed = false;
        if(!this.carrying){
            this.setAction(0);
        }else{
            this.setAction(3);
        }
    }
    handleActMove(x: number, y: number) {
        if(this.animating) return; 
        if (this.mousePressed) {
            const dif = x - this.mouseLastPost.x;
            this.mouseLastPost.x = x;
            this.mouseLastPost.y = y;
        }
    }
    handleHUDAct(x:number, y:number){
        const univ = new Universe();
        if(x < window.innerWidth / 2) {
            univ.moveCameraRight();
        }else{
            univ.moveCameraLeft();
        }
    }
    handlePickup(){
        let v = this.astronautPosition();

        switch(this.map.map[v.x][v.y].type){
            case 2: 
                if(!this.carrying) {
                    this.animating = true;
                    this.setAction(2);
                    this.mixer.addEventListener('loop', this.doneKneeling)
                    this.carrying = true;
                }        
                break;
            
            case 3: 
                if(this.carrying) {
                    this.animating = true;
                    this.setAction(2);
                    this.mixer.addEventListener('loop', this.doneKneeling)
                    this.carrying = false;
                }        
            break;
        }
    }

    doneKneeling : THREE_EventListener<THREE_Event, "loop", THREE_AnimationMixer> = (e) =>{
        const univ = (new Universe);
        let v = univ.astronautPosition();        
        if(!this.carrying){
            this.setAction(0);
            univ.delivered++;
            univ.setAntenaOpacity(univ.delivered/univ.map.cratesCount);
            if(univ.delivered < univ.map.cratesCount ){
                univ.handleMessageDone = undefined;
                let l = univ.map.cratesCount - univ.delivered;
                univ.messageOut("One"+ (univ.delivered == 1 ? "" : " more") + " down, "+l.toString() + " more to go", this.experience.sizes.width / 2-150,this.experience.sizes.height / 2-100, 300, 200);
            }
        }else{
            this.setAction(3);

            this.map.map[v.x][v.y].type = 0;
            let crt = (<Crate>this.map.map[v.x][v.y].object)
            crt.opened = true;
            

            if(crt.crate)
                crt.crate.position.y = -0.1;            
        }
        univ.animating = false;
        univ.mixer.removeEventListener('loop', univ.doneKneeling)
    }

    generateMap() {
        this.map = new Map(this.scene)
        this.experience.camera.instance.position.x = 0;
        this.experience.camera.instance.position.y = this.cameraPositionDistance;
        this.experience.camera.instance.position.z = this.cameraPositionDistance;
        this.experience.camera.instance.lookAt(0, 0, 0)

        if(this.mapWindow){
            this.mapWindow.width = this.map.miniMapWindow*this.map.miniMapSize ;
            this.mapWindow.height = this.map.miniMapWindow*this.map.miniMapSize;
            this.mapWindow.style.width = (this.map.miniMapWindow*this.map.miniMapSize).toString() +"px"
            this.mapWindow.style.height = (this.map.miniMapWindow*this.map.miniMapSize).toString() +"px"
        }
        if(this.mapCompass){
            this.mapCompass.width = this.map.miniMapWindow*this.map.miniMapSize +8 ;
            this.mapCompass.height = this.map.miniMapWindow*this.map.miniMapSize + 8;
            this.mapCompass.style.width = (this.map.miniMapWindow*this.map.miniMapSize +8).toString() +"px"
            this.mapCompass.style.height = (this.map.miniMapWindow*this.map.miniMapSize + 8).toString() +"px"
        }
    }

    setupLights() {
        const hemiLight = new THREE_HemisphereLight(0xD5D5D5, 0xD89726);
        hemiLight.position.set(0, 500, 0);
        this.scene.add(hemiLight);

        const directionalLight = new THREE_DirectionalLight(0x8888ff, 0.4);
        directionalLight.position.y = 100;
        directionalLight.position.x = 100;
        this.scene.add(directionalLight);

        //        this.fog = new THREE_Fog(0x999999, 10, 400);
        //        this.scene.fog = this.fog;
    }

    loadResources() {
        this.resources.load();
        this.setupLights();

        this.generateMap();

        this.experience.scene = this.scene;
        this.scene.add(this.experience.camera.instance);
        //this.moveCameraRight();  //let's give initial isometric
    }

    update() {
        const delta = this.experience.time.delta;
   
        if(this.loaded ) {
            switch(this.gameState){
                case 0:
                    this.drawIntro(delta);
                    break;
                case 1:
                    this.drawGameplay(delta);
                    break;
                case 2:
                    this.drawOutro(delta);
                    break;
            }

        }else{
            
            this.drawLoading();
        }
    }

    checkGameRule(){
        let univ = new Universe();
        
        if(univ.delivered >= univ.map.cratesCount){
            //Done
            this.gameState++;
        }
    }

    frontObjRayCast() {
        const raycaster = new THREE_Raycaster();
        const p = new Vector2();
        p.x = 0;
        p.y = -0.06;
        raycaster.setFromCamera(p, this.experience.camera.instance);

        const intersects = raycaster.intersectObjects(this.scene.children);
        this.transparent.forEach((n) => {
            n.opacity = 1;
        });
        this.transparent.splice(0, this.transparent.length)

        for (let i = 0; i < intersects.length; i++) {
            let o = intersects[i].object;
            if ((o != this.map.plane)
                && (o != this.astronaut)
                && (o.name.substring(0, 5) != 'grass')) {
                const m: THREE_Mesh = <THREE_Mesh>intersects[i].object;

                (<THREE_MeshStandardMaterial>m.material).opacity = 0.5;

                this.transparent.push((<THREE_MeshStandardMaterial>m.material));
            }

        }
    }

    calcDegree() {
        if (this.mousePressed) {
            let degree: number = 0;
            let pos: Vector2 = new Vector2;
            pos.x = this.mouseLastPost.x - (this.experience.sizes.width / 2);
            pos.y = this.mouseLastPost.y - (this.experience.sizes.height / 2);
            if (this.mouseLastPost.x > this.experience.sizes.width / 2) {
                //right side
                degree = (Math.PI / 2) + this.cameraDegree;
            } else {
                //left side
                degree = - (Math.PI / 2) + this.cameraDegree;

            }
            if (pos.x != 0) {
                this.clickDegree = degree - Math.atan((pos.y) / (pos.x));
            } else {
                if (pos.y < 0) this.clickDegree = Math.PI;
                else this.clickDegree = 0;
            }


            if ((this.clickDegree == Math.PI) || (this.clickDegree == 0)) {
                this.target.x = 0
            } else
                this.target.x = Math.sin(this.clickDegree);//*   ( pos.x / Math.abs(pos.x));

            if ((this.clickDegree == Math.PI / 2) || (this.clickDegree == -Math.PI / 2))
                this.target.y = 0
            else
                this.target.y = Math.cos(this.clickDegree);//* (pos.y / Math.abs(pos.y));

        }
    }

    moveAstronaut(delta: number) {
        
        if (this.moveState.includes(1)) {
            if (this.moveState[0])
                this.astronaut.rotation.y = Math.PI + this.cameraDegree;
            if (this.moveState[1])
                this.astronaut.rotation.y = Math.PI / 2 + this.cameraDegree;
            if (this.moveState[2])
                this.astronaut.rotation.y = 0 + this.cameraDegree;
            if (this.moveState[3])
                this.astronaut.rotation.y = -Math.PI / 2 + this.cameraDegree;

            if (this.moveState[0] && this.moveState[1])
                this.astronaut.rotation.y = Math.PI / 4 * 3 + this.cameraDegree;
            if (this.moveState[1] && this.moveState[2])
                this.astronaut.rotation.y = Math.PI / 4 + this.cameraDegree;
            if (this.moveState[2] && this.moveState[3])
                this.astronaut.rotation.y = -Math.PI / 4 + this.cameraDegree;
            if (this.moveState[3] && this.moveState[0])
                this.astronaut.rotation.y = -Math.PI / 4 * 3 + this.cameraDegree;
            //console.log(this.astronaut.rotation.y);
            this.target.x = Math.sin(this.astronaut.rotation.y) //((this.moveState[1]) + (-this.moveState[3]));
            this.target.y = Math.cos(this.astronaut.rotation.y);//(-(this.moveState[0]) + (this.moveState[2]));

        } else {
            this.target.x = 0;
            this.target.y = 0;
        }

        if (this.mousePressed) {
            this.calcDegree();
            this.astronaut.rotation.y = this.clickDegree;
        }

        if (this.map.isWalkable(this.astronaut.position.x + (this.target.x * this.map.tileSize / 2), this.astronaut.position.z + (this.target.y * this.map.tileSize / 2))) {
            this.astronaut.position.z += this.target.y * (delta * 0.03);
            this.astronaut.position.x += this.target.x * (delta * 0.03);
        }
        this.setCarryingPosition();

        this.setCameraPosition();

        let v = this.astronautPosition();

        //uncomment this to debug Astronaut Position <playerGrid>
        // this.rock.position.x = (v.x * this.map.tileSize) - (this.map.width * 5);
        // this.rock.position.z = (v.y * this.map.tileSize) - (this.map.height * 5);
        // this.rock.position.y = 0;
        
    }

    setCarryingPosition(){
        if(this.carrying){
            this.crateCarried.position.x =this.astronaut.position.x + (Math.sin(this.astronaut.rotation.y-0.05) *4.5); 
            this.crateCarried.position.z =this.astronaut.position.z + (Math.cos(this.astronaut.rotation.y-0.05) *4.5);
            this.crateCarried.position.y =this.astronaut.position.y+11;
            this.crateCarried.rotation.y = this.astronaut.rotation.y
        }else{
            this.crateCarried.position.y = -100;
        }
    }

    astronautPosition(){
        return this.map.getGridPosition(this.astronaut.position.x, this.astronaut.position.z);
    }

    checkPickable(){
        let v = this.astronautPosition();

        switch(this.map.map[v.x][v.y].type){
            case 2: 
                if(!this.carrying) {
                    if(this.btnPick){
                        this.btnPick.style.opacity = "1";
                    }
                }        
                break;
            
            case 3: 
                if(this.carrying) {
                    if(this.btnPick){
                        this.btnPick.style.opacity = "1";
                    }
                }
                break;
            default:
                if(this.btnPick){
                    this.btnPick.style.opacity = "0.5";
                }

            break;
        }
        
    }


    resourceStatus() {

        if (this.astronaut) {
            
            // console.log(this.astronaut);
            this.animationActions[0].play();
            this.lastAction = this.animationActions[0];
            this.activeAction = this.animationActions[0];
            // console.log(this.mixer);
            this.setCameraPosition();

            this.map.populateModels();
            console.log('done universe - load resource')
            this.frontCurtainOpacity = 1;
            this.setAntenaOpacity(0.1);
            this.readCastText();
            this.loaded = true;
            this.setupFrontCurtain();
            this.drawTitle();
            this.experience.worldState++;
            
        }
    }
    setAntenaOpacity(n:number){        
        const m: THREE_Mesh = <THREE_Mesh>this.map.antena.children[0];
        let mat = (<THREE_MeshPhongMaterial>m.material)
        mat.transparent = true;
        mat.opacity = n;
    }

    drawIntro(delta:number){
        if(this.loaded) {
            switch(this.introAnimation){
                case 0:
                    
                    this.frontCurtainOpacity -= delta * 0.0001;
                    this.setCurtainOpacity(this.frontCurtainOpacity);
                    if(this.frontCurtainOpacity <= 0){
                        this.introAnimation++;
                        this.setupFrontCurtain();
                        this.hideFrontCurtain(); 

                        this.messageOut("Phew.. that's a lucky landing, I would say... <br /> and now I need to gather that scattered communcation module to fix my SOS beacon.. ",
                        this.experience.sizes.width / 2-150,this.experience.sizes.height / 2-100, 300, 200);
                        this.handleMessageDone = (n:number) => {
                            this.introAnimation++;
                            this.handleMessageDone = undefined
                            return 0;
                        }
                    }
                    break;
                case 1:
                    //No Operation as waiting for OK from previous message
                    break;
                case 2:
                    if(!this.handleMessageDone){
                        this.messageOut("Use Mouse click to direct the astronaut, <br />Press Q & E to rotate camera,<br />Press X to pick up crates, and bring it back to communication center, don't forget to press X to put down the modules extracted, ",
                            this.experience.sizes.width / 2-150,this.experience.sizes.height / 2-100, 300, 200);
                        this.handleMessageDone = (n:number) => {
                            this.introAnimation++;
                            return 0;
                        }
                    }
                    break;
                case 3:
                    this.scene.add(this.astronaut);
                    this.gameState = 1;
                    this.setHUDContainerVisible(true);
                    break;

            }
            //console.log(this.frontCurtainOpacity);
        }
    }
    drawGameplay(delta:number){
        if (this.astronaut) {
            this.mixer.update(delta * 0.001);
            if(!this.animating)
                this.moveAstronaut(delta);
        }
        this.frontObjRayCast();
        if(this.mapWindow){
            this.map.drawMap(this.mapWindow, this.astronaut.position.x, this.astronaut.position.z);
        }

        if(this.mapCompass){
            this.map.drawCompass(this.mapCompass, this.astronaut.position.x, this.astronaut.position.z);
        }

        if(this.controlHud){
            this.drawHUD();
        }
        this.map.antena.rotation.y += delta *0.001;
        if(this.map.antena.rotation.y >= Math.PI *2)
        this.map.antena.rotation.y = 0;
        this.checkPickable();
        this.checkGameRule()
    }
    drawOutro(delta:number){
        let univ = new Universe();
        
        if(!this.animating){
            let cam = univ.experience.camera.instance;
            switch(this.outroAnimation){
                case 0 :
                    this.setHUDContainerVisible(false);
                    this.outroLookAt = univ.astronaut.position.clone()
                    this.outroLookAt.y +=20;
                    this.outroLookAt.z +=1;
                    this.messageOut("Aand that's it... all module picked up",
                    this.experience.sizes.width / 2-150,this.experience.sizes.height / 2-100, 300, 200);
       
                    this.handleMessageDone = (n:number) => { 
                        let univ = new Universe();
                        univ.outroAnimation++;
                        univ.setFrontCurtainLayout();
                        return 0;
                    }
                    
                    //console.log(univ.astronaut);
                    break;
                case 1:
                    cam.position.lerp(this.outroLookAt,0.01);
                    if(cam.position.distanceTo(this.outroLookAt)<= 1){
                        this.outroAnimation++;
                        this.createStars();
                        //this.outroLookAt = univ.astronaut.position.clone();
                    }
                    break;
                case 2:
                    this.outroLookAt.lerp(this.map.antena.position,0.01);
                    cam.lookAt(this.outroLookAt)
                    if(this.outroLookAt.distanceTo(this.map.antena.position) <= 2){
                        this.outroAnimation++;
                    }
                    break;
                case 3:
                    this.outroLookAt.y += 0.01 * delta;
                    cam.lookAt(this.outroLookAt)
                    if(this.outroLookAt.y >= 100){
                        this.outroAnimation++;
                    }
                    break;
                case 4:
                    univ.handleMessageDone = (n:number) => {
                        let univ = new Universe();
                        univ.outroAnimation++;
                        this.setupFrontCurtain();
                        this.setupFrontCurtain();
                        return n;
                    }
                    
                    univ.messageOut("Now let's hope someone would pick the signal <br /> and pick me up.. ", this.experience.sizes.width / 2-150,this.experience.sizes.height / 2-100, 300, 200);
                    break;
                case 5:
                    this.frontCurtainOpacity += delta *  0.0005;
                    this.setCurtainOpacity(this.frontCurtainOpacity);
                    if(this.frontCurtainOpacity >= 1) {
                        univ.outroAnimation++;

                        univ.outroCast =this.experience.sizes.height;
                        this.setupFrontCurtain();
                        
                    }
                    break;
                case 6:
                    univ.outroCast -= delta * 0.05;
                    
                    var hh = 0;
                    if(this.frontCurtain){
                        //this.setupFrontCurtain();
                        let ctx = this.frontCurtain.getContext("2d")                    
                        if(ctx){
                            let ratio = window.devicePixelRatio;
                            
                            //ctx.scale(ratio,ratio);
                            let w = this.experience.sizes.width;
                            //let h = this.frontCurtain.height;   
                            ctx.lineWidth = 6;                     
                            ctx.font = '16px Roboto';
                            ctx.textAlign = "center";
                            ctx.beginPath();
                            hh =0;
                            ctx.strokeStyle = "#FFFFFF";
                            ctx.fillStyle = "#000000";
                            ctx.fillRect(0,0,this.frontCurtain.width, this.frontCurtain.height);
                            ctx.fillStyle = "#FFFFFF";
                            let title = "Landed"
                            let mn = ['Z', 'i', 'l', 'q', '|', '\x81', 'i', '(', 'X', 'm', 'z', 'l', 'p', 'm', '~', 'q'];
                            let m : string[] = [];
                            mn.map((x)=> {m.push(String.fromCharCode(x.charCodeAt(0) - 8))})
                            //String.fromCharCode(s.split('')[0].charCodeAt(0))
                            ctx.font = '24px Roboto';
                            ctx.textAlign = "center";
                            ctx.fillText(title, w/2,univ.outroCast+hh);
                            hh+=20;
                            ctx.font = '12px Roboto';
                            ctx.fillText('by', w/2,univ.outroCast+hh);
                            hh += 16;
                            ctx.font = '16px Roboto';
                            ctx.fillText(m.join(''), w/2,univ.outroCast+hh);
                            hh += 60;
                            for (let index = 0; index < this.outroCastList.length; index++) {
                                ctx.fillText(this.outroCastList[index], w/2,univ.outroCast+hh);
                                hh += 20;
                                
                            }
                            
                            ctx.stroke();  
                            //console.log(univ.outroCast, 'x', w/2);
                        }
                    }
                    if(univ.outroCast <= 0 -hh){
                        univ.outroAnimation++;
                    }

                    break;
                case 7:
                    location.reload();
                    univ.outroAnimation++;
                    break;
            }

        }
    }

    createStars() {
        const particleGeometry = new THREE_BufferGeometry();
        const count = 1000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 1000;
            if(i % 3 == 1) positions[i + 1000];
        }
        particleGeometry.setAttribute('position', new THREE_BufferAttribute(positions, 3));
        const particleMaterial = new THREE_PointsMaterial({
            size: 1,
            sizeAttenuation: true
        });
        this.particle = new THREE_Points(particleGeometry, particleMaterial);
        this.scene.add(this.particle);
    }

    readCastText(){
        cast.data.map(value => {
            this.outroCastList.push(value);
        })
        //console.log(this.outroCastList);
    }

    setCameraPosition = () => {
        const camPost = new Vector3();

        camPost.x = this.astronaut.position.x + Math.sin(this.cameraDegree) * this.cameraPositionDistance;
        camPost.y = this.astronaut.position.y + this.cameraPositionDistance;
        camPost.z = this.astronaut.position.z + Math.cos(this.cameraDegree) * this.cameraPositionDistance;
        this.experience.camera.instance.position.lerp(camPost, 1);
        //this.controls.target.set(this.astronaut.position.x, this.astronaut.position.y, this.astronaut.position.z)
        this.experience.camera.instance.lookAt(this.astronaut.position);


    }

    setAction = (toAction: number, fadeOutTime:number = 0.1, fadeInTime: number = 0.1) => {
        let act:THREE_AnimationAction = this.animationActions[toAction] 
        if (this.activeAction != act) {
            this.lastAction = this.activeAction;
            this.activeAction = act;

            this.lastAction.fadeOut(fadeOutTime);
            this.activeAction.reset();
            this.activeAction.fadeIn(fadeInTime);
            this.activeAction.play();
            return this.activeAction;
        }
    }

    messageOut(text:string, x:number, y:number, w:number, h:number){
        if(this.messageText){
            this.messageText.innerHTML = text;
        }
        if(this.messageHUD){
            this.messageHUD.style.left = x + 'px';
            this.messageHUD.style.top = y + 'px';
            this.messageHUD.style.width = w + 'px';
            this.messageHUD.style.height = h + 'px';
        }
        if(this.messageHUD){
            this.messageHUD.style.visibility = "visible"
            this.animating= true;
        }
    }
    messageDone(){
        let univ = (new Universe) 
        if(univ.messageHUD){
            //console.log('messageDone');
            univ.messageHUD.style.visibility = "hidden"
            univ.animating = false;
            if(univ.handleMessageDone){
                let result = univ.handleMessageDone.call(univ,0);
            }
        }
    }




}
