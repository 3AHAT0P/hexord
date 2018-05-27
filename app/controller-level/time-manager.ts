import { bind } from '../../lib';

const LOOP_MIN_TIME = 30;

export default class TimeManager {
  private timerId: number = null;

  private queues: Map<string, Set<CallBack>> = new Map<string, Set<CallBack>>();

  private async tick() {
    const timestamp = Date.now();
    for (const cb of this.queues.get('currentLoop')) {
      await cb();
    }
    for (const cb of this.queues.get('currentLoopRendering')) {
      await cb();
    }
    this.queues.set('currentLoop', this.queues.get('nextLoop'));
    this.queues.set('currentLoopRendering', this.queues.get('nextLoopRendering'));
    this.queues.set('nextLoop', new Set<CallBack>());
    this.queues.set('nextLoopRendering', new Set<CallBack>());
    const waitTime = timestamp + LOOP_MIN_TIME - Date.now();
    if (waitTime < 0) console.log('So Long Loop: ', -waitTime);
    setTimeout(this.tick, waitTime > 0 ? waitTime : 1);
  }

  constructor() {
    this.tick = this.tick.bind(this);
    this.queues.set('currentLoop', new Set<CallBack>());
    this.queues.set('nextLoop', new Set<CallBack>());
    this.queues.set('currentLoopRendering', new Set<CallBack>());
    this.queues.set('nextLoopRendering', new Set<CallBack>());
  }

  public start() {
    this.tick();
  }

  public addToLoop(cb: CallBack, loopName = 'currentLoop'): void {
    this.queues.get(loopName).add(cb);
  }

  public addToCurrentRenderingLoop(cb: CallBack): void {
    this.queues.get('currentLoopRendering').add(cb);
  }

  public next(cb: CallBack): void {
    this.queues.get('nextLoop').add(cb);
  }

  public afterRendering(cb: CallBack): void {
    this.queues.get('nextLoopRendering').add(cb);
  }
}
