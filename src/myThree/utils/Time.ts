import EventEmitter from './EventEmitterTS';

export default class Time extends EventEmitter {
    start: number = Date.now();
    current: number = this.start;
    elapsed: number = 0;
    delta: number = 16;

    constructor() {
        super();

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    reset() {
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;
    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        this.trigger('tick', []);

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }
}