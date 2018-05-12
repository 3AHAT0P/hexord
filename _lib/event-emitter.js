import { ExtendedArray } from './extends'

const wait = async (time) => {
  await new Promise((resolve) => setTimeout(resolve, time));
}

const next = async (cb) => {
  await wait(1);
  await cb();
}

export default class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, listener, ctx) {
    if (!this.events.has(eventName))
      this.events.set(eventName, new ExtendedArray());
    this.events.get(eventName).push([listener.bind(ctx), false]);
    return this;
  }

  once(eventName, listener, ctx) {
    if (!this.events.has(eventName))
      this.events.set(eventName, new ExtendedArray());
    this.events.get(eventName).push([listener.bind(ctx), true]);
    return this;
  }

  emit(eventName, ...data) {
    const listeners = this.events.get(eventName);
    if (listeners == null) return;
    for (let i = 0; i < listeners.length; ++i) {
      const [listener, once] = listeners[i];
      next(listener.bind(null, ...data));
      if (once) listeners.splice(i--, 1);
    }
  }

  async emitSync(eventName, ...data) {
    const listeners = this.events.get(eventName);
    if (listeners == null) return;
    for (let i = 0; i < listeners.length; ++i) {
      const [listener, once] = listeners[i];
      await next(listener.bind(null, ...data));
      if (once) listeners.splice(i--, 1);
    }
  }

}
