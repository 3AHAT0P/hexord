import EventEmitter from '../event-emitter';
import { UUID } from '../utils';

const _eventEmitterSymbol = Symbol('_eventEmitter');
const _eventEmitterPrefixSymbol = Symbol('_eventEmitterPrefix');

export default function EventedMixin(BaseClass = Object) {
  return class EventedMixin extends BaseClass {
    constructor(...args) {
      super(...args);
      this[_eventEmitterSymbol] = new EventEmitter();
      this[_eventEmitterPrefixSymbol] = UUID();
    }

    on(eventName, listener) {
      return this[_eventEmitterSymbol].on(`${this[_eventEmitterPrefixSymbol]}::${eventName}`, listener, this);
    }

    once(eventName, listener) {
      return this[_eventEmitterSymbol].once(`${this[_eventEmitterPrefixSymbol]}::${eventName}`, listener, this);
    }

    emit(eventName, ...data) {
      return this[_eventEmitterSymbol].emit(`${this[_eventEmitterPrefixSymbol]}::${eventName}`, ...data);
    }
  }
}
