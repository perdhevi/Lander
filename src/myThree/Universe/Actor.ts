import * as THREE from 'three'

export default class Actor{
    position : THREE.Vector4 = new THREE.Vector4(0, 0, 0, 0); //x,y,z, heading
    state : number = 0;
}