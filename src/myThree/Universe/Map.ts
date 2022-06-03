import * as THREE from 'three'

import TextureURL from '../images/planet_color.jpg';
//import TextureRoughnessURL from '../images/planet_texture.jpg';
import TextureNormalURL from '../images/planet_barren_Normal_OpenGL.jpg';
import Resources from './Resources';
import { Vector2 } from 'three';
import Universe from '../Universe';
//import { Experience } from '../Experience';

export class Rock {
  width: number = 10;
  height: number = 10;
  x: number = -1;
  y: number = -1;
  type: number = 0;
  direction: number = 0;
  rock!: THREE.Group;
  rockModelIndex: number = 0;
  highlightTile: boolean = false;
  hightLightModel!: THREE.Group;
}

class RockFormation {
  resource_id: number = 0;
  width: number = 1;
  height: number = 1;
  map: number[][] = []
  highlight: boolean = false
}

export class Crate  {
  x: number=0;
  y: number = 0;
  opened:boolean = false;
  crate: THREE.Group | undefined;
}


export class Grass {
  x: number = 0;
  y: number = 0;

  subX: number = 0;
  subY: number = 0;

  type: number = 0;

  grass!: THREE.Group;
}
export class Tile {
  type: number = 0;  // 0:walkable 1:not walkable
  object: Rock | Crate | undefined;  // 
}

const rockFormation: RockFormation[] = [
  {  //0
    resource_id: 2,
    width: 1,
    height: 1,
    map: [[1]],
    highlight: true
  },
  { //1
    resource_id: 3,
    width: 1,
    height: 1,
    map: [[1]],
    highlight: true
  },
  { //2
    resource_id: 4,
    width: 2,
    height: 1,
    map: [[1], [1]],
    highlight: true
  },
  { //3
    resource_id: 5,
    width: 2,
    height: 2,
    map: [[1, 0], [1, 1]],
    highlight: true
  },
  {  //4
    resource_id: 6,
    width: 5,
    height: 5,
    map: [
      [1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 1, 1]
    ],
    highlight: true
  },
  {  //5
    resource_id: 7,
    width: 5,
    height: 4,
    map: [
      [0, 1, 1, 0],
      [1, 1, 1, 1],
      [0, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
    ],
    highlight: true
  },
]

export default class Map {
  width: number = 100;
  height: number = 100;
  tileSize: number = 10;
  rocksCount: number = 150;
  miniMapSize : number = 4;
  miniMapWindow:number = 30;
  cratesCount:number = 5;
  map: Tile[][] = [];

  scene!: THREE.Scene;

  planeGeometry!: THREE.PlaneGeometry;
  planeMaterial!: THREE.MeshStandardMaterial;
  plane!: THREE.Mesh;

  startGeometry!: THREE.ConeGeometry
  startMaterial!: THREE.MeshBasicMaterial;
  start!: THREE.Mesh;


  fruitGeometry: THREE.SphereGeometry[] = [];
  fruitMaterial: THREE.MeshBasicMaterial[] = [];
  fruit: THREE.Mesh[] = [];

  rocks: Rock[] = [];
  grass: Grass[] = [];
  crates: Crate[] = [];

  borderWallSouth: THREE.Group[] = [];
  borderWallNorth: THREE.Group[] = [];
  borderWallEast: THREE.Group[] = [];
  borderWallWest: THREE.Group[] = [];


  textureLoader = new THREE.TextureLoader();
  planeColor!: THREE.Texture;
  planeNormal!: THREE.Texture;
  planeRoughness!: THREE.Texture;

  platformGeometry! : THREE.BoxGeometry;
  platformMateria! : THREE.MeshBasicMaterial;
  platform!: THREE.Mesh;

  antena!: THREE.Group;
  pod!: THREE.Group;

  constructor(_scene: THREE.Scene) {
    console.log('Map instantiate');
    this.scene = _scene;
    this.generateMap();
  }

  getRandomGrid(width: number, height: number) {
    let placed = false;
    let x: number = -1;
    let y: number = -1
    while (!placed) {
      x = Math.floor(Math.random() * (this.width));
      y = Math.floor(Math.random() * (this.height));
      if ((x + width < this.width) && (y + height < this.height)) {
        placed = true;
        let o = 0;

        for (o = 0; o < width; o++) {
          for (let k = 0; k < height; k++) {
            if (this.map[x + o][y + k].type != 0)
              placed = false;
          }
        }
      }


    }
    if ((placed) && (x != -1) && (y != -1)) {
      let v = new Vector2(x, y);
      return v;
    }
  }

  generateMap() {
    //base initialization
    for (let i = 0; i < this.width; i++) {
      this.map[i] = [];
      for (let j = 0; j < this.height; j++) {
        var content = new Tile();
        this.map[i][j] = content;
      }
    }
    //set up clearance
    let midX = this.width / 2 -2;
    let midY = this.height / 2 - 2;
    for(let wi = 0;wi < 4;wi ++ ){
      for(let hi = 0;hi < 4; hi++){
        if((wi>0)&&(wi<2)&&(hi>0)&&(hi<2))
          this.map[midX+wi][midY +hi].type = 1
        else        
          this.map[midX+wi][midY +hi].type = 3
      }
    }
    //escape pod
    for(let wi = 0;wi < 3;wi ++ ){
      for(let hi = 0;hi < 3; hi++){
        this.map[midX+wi+4][midY +hi].type = 1
      }
    }



    var v = new Vector2(midX+2, midY + 6);
    //this.addRocks(5, pos);
    let c = new Crate();
    this.map[v.x][ v.y].type = 2;
    this.map[v.x][ v.y].object = c;
    c.x = v.x;
    c.y = v.y;
    this.crates.push(c);

    this.generateCrates(this.cratesCount);
    this.generateRocks();
    this.generateGrass();
  }

  generateCrates(n:number){
    for(let i=this.crates.length;i<n;i++){
      let v = this.getRandomGrid(1,1);
      if(v){
        let c = new Crate();
        this.map[v.x][ v.y].type = 2;
        this.map[v.x][ v.y].object = c;
        c.x = v.x;
        c.y = v.y;

        this.crates.push(c);
      }
    }
    //console.log('crates ', this.crates);
  }

  addRocks(formation: number, pos: Vector2 | undefined = undefined) {
    const rock = new Rock();
    rock.width = rockFormation[formation].width;
    rock.height = rockFormation[formation].height;
    rock.highlightTile = rockFormation[formation].highlight;
    rock.rockModelIndex = rockFormation[formation].resource_id;
    let v: Vector2 | undefined;
    if (pos != undefined)
      v = pos;
    else
      v = this.getRandomGrid(rock.width, rock.height);

    if (v) {
      rock.x = v.x;
      rock.y = v.y;

      for (var o = 0; o < rock.width; o++) {
        for (var k = 0; k < rock.height; k++) {
          let t = rockFormation[formation].map[o][k];
          this.map[v.x + o][v.y + k].type = t;
          this.map[v.x + o][v.y + k].object = rock;
        }
      }
      this.rocks.push(rock);
    }

  }

  generateRocks() {


    for (var i = 0; i < this.rocksCount; i++) {
      let formation = Math.floor(Math.random() * rockFormation.length);
      this.addRocks(formation);
    }

  }
  generateGrass() {
    for (let i = 0; i < 200; i++) {
      let v = this.getRandomGrid(1, 1);
      if (v) {
        let grass = new Grass();
        grass.x = v.x;
        grass.y = v.y;
        grass.subX = (Math.random() * this.tileSize) - (this.tileSize / 2);
        grass.subY = (Math.random() * this.tileSize) - (this.tileSize / 2);

        grass.type = Math.round((Math.random() * 3));

        this.grass.push(grass);
      }
    }
  }

  populateModels() {
    this.createPlane();
    this.populateObjectsModels();
    this.populateWallModels();
    this.populateRocksModels();
    this.populateGrassModels();
  }

  createPlane() {
    this.planeGeometry = new THREE.PlaneGeometry((this.width + 2) * this.tileSize, (this.height + 2) * this.tileSize);
    this.planeColor = this.textureLoader.load(TextureURL);
    this.planeRoughness = this.textureLoader.load(TextureURL);//TextureRoughnessURL);
    this.planeRoughness.wrapS = THREE.RepeatWrapping;
    this.planeRoughness.wrapT = THREE.RepeatWrapping;
    this.planeRoughness.repeat.set(this.width, this.height);

    this.planeNormal = this.textureLoader.load(TextureNormalURL);
    this.planeMaterial = new THREE.MeshStandardMaterial({ map: this.planeColor, roughnessMap: this.planeRoughness, normalMap: this.planeRoughness, side: THREE.DoubleSide });

    this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
    this.plane.rotateX(Math.PI / 2);
    this.plane.position.x -= this.tileSize / 2;
    this.plane.position.z -= this.tileSize / 2;
    this.scene.add(this.plane);


    this.platformGeometry = new THREE.BoxGeometry( this.tileSize * 4, 0.25, this.tileSize * 4);
    this.platformMateria = new THREE.MeshBasicMaterial({color: 0x7b4234}); //{  color: 0x7b4234 }
    this.platform = new THREE.Mesh(this.platformGeometry, this.platformMateria);

    this.platform.position.x = -this.tileSize/2;//(this.width * this.tileSize /2);
    this.platform.position.z = -this.tileSize/2;//(this.height * this.tileSize /2);
    this.platform.position.y = 0.25;
    this.scene.add(this.platform);
  }

  populateObjectsModels(){
    const res = new Resources();

    //creates
    for(let i=0;i<this.crates.length;i++){
      let cr = res.objects[0].clone();
      if(cr){
        cr.position.x = (this.crates[i].x * this.tileSize) - (this.width * this.tileSize /2);
        cr.position.z = (this.crates[i].y * this.tileSize) - (this.height * this.tileSize /2);
        cr.position.y = 5;//Math.floor(Math.random() * 5);
      }
      this.crates[i].crate = cr;
      if(this.crates[i].crate)
        this.scene.add(cr);
    }

    //antena
    this.antena = res.objects[1].clone();
    this.antena.position.x = -this.tileSize *2 / 2;
    this.antena.position.z = -this.tileSize*2 /2;
    this.antena.position.y = 0;
    this.scene.add(this.antena);

    //escape
    this.pod = res.objects[2].clone();
    this.pod.position.x = this.tileSize *3;
    this.pod.position.z = -this.tileSize*2 /2;
    this.pod.position.y = 0;
    this.scene.add(this.pod);

  }
  populateWallModels() {
    const res = new Resources();
    //let's build a wall surrounding

    for (let i = 0; i < this.width / 10; i++) {
      const index = Math.floor(Math.random() * 2);
      let wall = res.cliff[1].clone();
      (<THREE.Mesh>wall.children[0]).material = res.environmentMaterial.clone();
      (<THREE.MeshStandardMaterial>(<THREE.Mesh>(wall.children[0])).material).transparent = true;

      wall.position.x = (i * this.tileSize * 12) - ((this.width * this.tileSize) / 2);
      wall.position.z = -(this.height * this.tileSize / 2) - (this.tileSize * 6);
      this.borderWallNorth[i] = wall;
      let wall2 = wall.clone();
      wall2.position.z = (this.height * this.tileSize / 2) + (this.tileSize / 2);
      this.borderWallSouth[i] = wall2;

      this.scene.add(this.borderWallNorth[i]);
      this.scene.add(this.borderWallSouth[i]);

    }

    for (let i = 0; i < this.height / 2; i++) {
      const index = Math.floor(Math.random() * 2);
      let wall = res.cliff[1].clone();
      (<THREE.Mesh>wall.children[0]).material = res.environmentMaterial.clone();
      (<THREE.MeshStandardMaterial>(<THREE.Mesh>(wall.children[0])).material).transparent = true;
      wall.rotation.y = Math.PI / 2
      wall.position.z = (i * this.tileSize * 12) - ((this.width * this.tileSize) / 2);
      wall.position.x = -(this.height * this.tileSize / 2) - (this.tileSize * 6);
      this.borderWallWest[i] = wall;
      let wall2 = wall.clone();
      wall2.position.x = (this.height * this.tileSize / 2) + (this.tileSize / 2);
      this.borderWallEast[i] = wall2;

      this.scene.add(this.borderWallWest[i]);
      this.scene.add(this.borderWallEast[i]);

    }


  }

  populateRocksModels() {
    const res = new Resources();
    //fill all rocks
    for (let i = 0; i < this.rocks.length; i++) {
      //const index = Math.floor(Math.random() * 2) + 2;
      //console.log('rocks #', i, ' index ', index)
      const index = this.rocks[i].rockModelIndex;
      this.rocks[i].rock = res.cliff[index].clone();
      (<THREE.Mesh>this.rocks[i].rock.children[0]).material = res.environmentMaterial.clone();
      (<THREE.MeshStandardMaterial>(<THREE.Mesh>(this.rocks[i].rock.children[0])).material).transparent = true;


      this.rocks[i].rock.position.x = (this.rocks[i].x * this.tileSize) - (this.width * 5) + ((this.rocks[i].width - 1) / 2 * this.tileSize);
      this.rocks[i].rock.position.z = (this.rocks[i].y * this.tileSize) - (this.height * 5) + ((this.rocks[i].height - 1) / 2 * this.tileSize);
      this.rocks[i].rock.position.y = 0;

      this.scene.add(this.rocks[i].rock)

      if (this.rocks[i].highlightTile) {
        const rockMaterial = new THREE.MeshBasicMaterial({ color: 0x7b4234, side: THREE.DoubleSide });
        this.rocks[i].hightLightModel = new THREE.Group();
        let mapX = this.rocks[i].x;
        let mapY = this.rocks[i].y;
        for (var w = 0; w < this.rocks[i].width; w++) {
          for (var h = 0; h < this.rocks[i].height; h++) {
            if (this.map[mapX + w][mapY + h].type === 1) {
              const rockGeometry = new THREE.BoxGeometry(this.tileSize, 2, this.tileSize);
              const rockMesh = new THREE.Mesh(rockGeometry, rockMaterial);
              rockMesh.position.x = (w * this.tileSize) - ((this.rocks[i].width - 1) / 2 * this.tileSize);
              rockMesh.position.z = (h * this.tileSize) - ((this.rocks[i].height - 1) / 2 * this.tileSize);
              this.rocks[i].hightLightModel.add(rockMesh);
            }
          }
        }

        this.rocks[i].hightLightModel.position.x = (this.rocks[i].x * this.tileSize) - (this.width * 5) + ((this.rocks[i].width - 1) / 2 * this.tileSize);
        this.rocks[i].hightLightModel.position.z = (this.rocks[i].y * this.tileSize) - (this.height * 5) + ((this.rocks[i].height - 1) / 2 * this.tileSize);
        this.rocks[i].hightLightModel.position.y = 0;

        this.scene.add(this.rocks[i].hightLightModel)
      }
    }

    console.log('map model created');
  }

  populateGrassModels() {
    const res = new Resources();
    for (let i = 0; i < this.grass.length; i++) {
      let v = this.getWorldPosition(new Vector2(this.grass[i].x, this.grass[i].y));


      this.grass[i].grass = res.plant[this.grass[i].type + 1].clone();
      this.grass[i].grass.scale.set(5, 5, 5);
      this.grass[i].grass.position.x = v.x + this.grass[i].subX;
      this.grass[i].grass.position.z = v.y + this.grass[i].subY;
      this.scene.add(this.grass[i].grass)
    }
  }

  getWorldPosition(v: Vector2) {
    let rs = new Vector2();
    rs.x = (v.x * this.tileSize) - (this.width * (this.tileSize / 2));
    rs.y = (v.y * this.tileSize) - (this.height * (this.tileSize / 2));

    return rs;
  }

  getGridPosition(x: number, y: number) {
    let result = new THREE.Vector2();
    result.x = Math.round((x + (this.width * 5)) / this.tileSize);
    result.y = Math.round((y + (this.height * 5)) / this.tileSize);

    return result;
  }

  isWalkable(x: number, y: number) {
    let grid = this.getGridPosition(x, y);
    
    //outside map grid
    if ((grid.x >= this.width) || (grid.y >= this.height) || (grid.x < 0) || (grid.y < 0)) {
      return false;
    }
    var result = true;
    // it's a wall
    switch(this.map[grid.x][grid.y].type){
      case 1 : result = false;
      break;
      case 2 :
        // console.log(x, 'x', y)
        //   var cx = (x + (this.width * (this.tileSize/2))) - (grid.x * this.tileSize) + this.tileSize/2;
        //   var cy = (y + (this.height * this.tileSize/2)) - (grid.y * this.tileSize) + this.tileSize/2;
        //   console.log('rel', cx, 'x', cy)
        //   if((cx>= this.tileSize * 0.3)&&(cx<= this.tileSize*0.7)&&(cy>= this.tileSize*0.3)&&(cy <= this.tileSize *0.7))
        //     result = false;
        //   else
            result = true;
        break;
    }
    

    return result;
  }

  drawCompass(canvas:HTMLCanvasElement, x:number, y:number){
    var ctx = canvas.getContext("2d");
    var v = this.getGridPosition(x,y);

    ctx?.fillRect(0,0,this.miniMapSize * this.miniMapWindow + 8, this.miniMapSize * this.miniMapWindow + 8);
    if(ctx){
      let middle = (this.miniMapWindow/2)*this.miniMapSize;
      ctx.lineWidth = this.miniMapSize;
      ctx.strokeStyle = "#FFFF00";
      for(let i=0;i < this.crates.length; i++){
        if(!this.crates[i].opened) {
          ctx.beginPath();
          ctx?.moveTo((this.miniMapWindow/2)*this.miniMapSize,(this.miniMapWindow/2)*this.miniMapSize);
          let cx = ((this.crates[i].x-v.x)*this.miniMapSize) + middle;
          let cy = ((this.crates[i].y-v.y)*this.miniMapSize)+ middle;
          ctx.lineTo(cx, cy);
          ctx.stroke();
        }
      }

      let midX = this.width / 2 ;
      let midY = this.height / 2 ;
      ctx.strokeStyle = "#00FF00";      
      ctx.beginPath()
      ctx?.moveTo((this.miniMapWindow/2)*this.miniMapSize,(this.miniMapWindow/2)*this.miniMapSize);
      let cx = ((midX-v.x)*this.miniMapSize) + middle;
      let cy = ((midY-v.y)*this.miniMapSize)+ middle;
      ctx.lineTo(cx, cy);
      ctx.stroke();      
    }
  }

  drawMap(canvas:HTMLCanvasElement, x:number, y:number){
    var ctx = canvas.getContext("2d");
    var v = this.getGridPosition(x,y);
    if(ctx){
      // ctx.beginPath();
      // ctx.rotate((new Universe).cameraDegree)
      for(var i=-(this.miniMapWindow/2);i<(this.miniMapWindow/2);i++){
        for(var j=-(this.miniMapWindow/2);j<(this.miniMapWindow/2);j++){

          x = v.x + i;
          y = v.y + j;

          if((x<0)||(x>=this.width)||(y<0)||(y>=this.height)){
            if(ctx != null)
              ctx.fillStyle = "#000000";
          } else
          switch(this.map[x][y].type){
            case 0:
              if(ctx != null)
                ctx.fillStyle = "#d49e54";
              break;
            case 1:
              if(ctx)
                ctx.fillStyle = "#7b4333";
              break;
            case 2:
              if(ctx)
                ctx.fillStyle = "#FFD700"
              break;
            case 3:
              if(ctx)
                ctx.fillStyle = "#00FF00"
              break;
      
              }
          ctx?.fillRect(
            (i+(this.miniMapWindow/2))*this.miniMapSize, 
            (j+(this.miniMapWindow/2))*this.miniMapSize,
            this.miniMapSize,
            this.miniMapSize)

        }
      }
      ctx.fillStyle = "#FF0000";
      ctx.fillRect((this.miniMapWindow/2)*this.miniMapSize,(this.miniMapWindow/2)*this.miniMapSize,this.miniMapSize, this.miniMapSize);
      let univ = new Universe();

      let dx = (this.miniMapWindow/2)* this.miniMapSize + Math.sin(univ.cameraDegree) * (this.miniMapSize*4) + (this.miniMapSize/2);
      let dy = (this.miniMapWindow/2)* this.miniMapSize + Math.cos(univ.cameraDegree) * (this.miniMapSize*4) + (this.miniMapSize/2);

      let dx2 = (this.miniMapWindow/2)* this.miniMapSize + Math.sin(univ.cameraDegree + (Math.PI / 2)) * (this.miniMapSize*3) + (this.miniMapSize/2);
      let dy2 = (this.miniMapWindow/2)* this.miniMapSize + Math.cos(univ.cameraDegree + (Math.PI / 2)) * (this.miniMapSize*3) + (this.miniMapSize/2);

      ctx.beginPath();
      ctx.moveTo(dx,dy);
      ctx.lineTo(dx2, dy2);
      dx2 = (this.miniMapWindow/2)* this.miniMapSize + Math.sin(univ.cameraDegree - (Math.PI / 2)) * (this.miniMapSize*3)+ (this.miniMapSize/2);
      dy2 = (this.miniMapWindow/2)* this.miniMapSize + Math.cos(univ.cameraDegree - (Math.PI / 2)) * (this.miniMapSize*3)+ (this.miniMapSize/2);
      ctx.lineTo(dx2, dy2);
      //ctx.lineTo((this.miniMapWindow/2)*this.miniMapSize,(this.miniMapWindow/2)*this.miniMapSize);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.5;
      ctx.fill();
    }
  }  
}