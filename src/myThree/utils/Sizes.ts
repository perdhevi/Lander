import { Experience } from '../Experience';
import EventEmitter from './EventEmitterTS';

export default class Size extends EventEmitter {
  width: number = window.innerWidth-20;
  height: number = window.innerHeight;
  initialWidth:number = window.innerWidth;
  initialHeigh:number = window.innerHeight;
  pixelRatio: number = Math.min(window.devicePixelRatio, 2);
  instance?: Size;
  halfHeightMode: boolean = true;
  heightCalc?: () => number;

  constructor() {
    super()
    if (this.instance)
      return this.instance;

    this.instance = this;
    this.halfHeightMode = true;
    // Setup
    this.setup();


  }
  setup() {
    window.addEventListener('resize', () => {
      // console.log('resize trigger inner', window.innerWidth, ' x ', window.innerHeight);
      // console.log('resize trigger outer', window.outerWidth, ' x ', window.outerHeight);

      //this.width = window.innerWidth;
      // if (this.halfHeightMode)
      //   this.height = window.innerHeight / 2;
      // else {
        const exp = new Experience();
        if(window.innerWidth != window.outerWidth){
          this.width = window.outerWidth-5;
          console.log('resize trigger inner', window.innerWidth, ' x ', window.innerHeight);
          console.log('resize trigger outer', window.outerWidth, ' x ', window.outerHeight);
        }else
          this.width = window.outerWidth;// - (window.outerWidth - window.innerWidth);
        //console.log('worldState:', exp.worldState);

        if (exp.worldState < 1){
          this.height = exp.world.heightCalc();
          //console.log('resized screen', this.width, ' x ', this.height);
        }else
          this.height = window.innerHeight;
      //}
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)
      this.trigger('resize', []);
    })
  }
}