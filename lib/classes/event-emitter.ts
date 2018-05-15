import { nextSync } from "../";

import { ExtendedArray } from "./";

export default class EventEmitter {
  protected events: Map<string, ExtendedArray> = new Map<string, ExtendedArray>();

  public on(eventName: string, listener: () => any, ctx: any): EventEmitter {
    if (!this.events.has(eventName)) this.events.set(eventName, new ExtendedArray());
    this.events.get(eventName).push([listener.bind(ctx), false]);
    return this;
  }

  public once(eventName: string, listener: () => any, ctx: any): EventEmitter {
    if (!this.events.has(eventName)) this.events.set(eventName, new ExtendedArray());
    this.events.get(eventName).push([listener.bind(ctx), true]);
    return this;
  }

  public emit(eventName: string, ...data: any[]): EventEmitter {
    const listeners = this.events.get(eventName);
    if (listeners == null) return this;
    for (let i = 0; i < listeners.length; ++i) {
      const [listener, once] = listeners[i];
      nextSync(listener.bind(null, ...data));
      if (once) listeners.splice(i--, 1);
    }
    return this;
  }

  public async emitSync(eventName: string, ...data: any[]): Promise<EventEmitter> {
    const listeners = this.events.get(eventName);
    if (listeners == null) return this;
    const promises = [];
    for (let i = 0; i < listeners.length; ++i) {
      const [listener, once] = listeners[i];
      promises.push(nextSync(listener.bind(null, ...data)));
      if (once) listeners.splice(i--, 1);
    }
    await Promise.all(promises);
    return this;
  }

}
