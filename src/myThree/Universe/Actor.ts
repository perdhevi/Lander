import {Vector4 as THREE_Vector4} from 'three'

export default class Actor{
    position : THREE_Vector4 = new THREE_Vector4(0, 0, 0, 0); //x,y,z, heading
    state : number = 0;
}