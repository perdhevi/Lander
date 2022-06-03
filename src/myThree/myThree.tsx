

//import * as THREE from 'three';
import { Experience } from './Experience';


const myThree = () => {

  console.log('start My Three');
  const mycanvas: HTMLCanvasElement | undefined = document.querySelector<HTMLCanvasElement>('canvas.webgl') ?? undefined;
  let exp:Experience = new Experience(mycanvas);

}

myThree();
export default myThree;