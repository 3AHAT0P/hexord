import { EventEmitter, uuid } from "../";

const eventEmitterSymbol = Symbol("_eventEmitter");
const eventEmitterPrefixSymbol = Symbol("_eventEmitterPrefix");

export default (BaseClass = Object) => {
  return class EventedMixin extends BaseClass {
    private [eventEmitterSymbol]: EventEmitter = new EventEmitter();
    private [eventEmitterPrefixSymbol]: string = uuid();

    constructor(...args: any[]) {
      super(...args);
    }

    public on(eventName: string, listener: () => any) {
      return this[eventEmitterSymbol].on(`${this[eventEmitterPrefixSymbol]}::${eventName}`, listener, this);
    }

    public once(eventName: string, listener: () => any) {
      return this[eventEmitterSymbol].once(`${this[eventEmitterPrefixSymbol]}::${eventName}`, listener, this);
    }

    public emit(eventName: string, ...data: any[]) {
      return this[eventEmitterSymbol].emit(`${this[eventEmitterPrefixSymbol]}::${eventName}`, ...data);
    }
  };
};
