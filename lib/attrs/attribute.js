export default (deserialize, serialize) => {
  return (target, key, descriptor) => {
    return {
      enumerable: descriptor.enumerable,
      configurable: true,
      get() {
        if (this[Symbol.for('#meta')].attributes == null) this[Symbol.for('#meta')].attributes = {};
        if (this[Symbol.for('#meta')].attributes[key] == null) this[Symbol.for('#meta')].attributes[key] = {};
        this[Symbol.for('#meta')].attributes[key].deserialize = deserialize;
        this[Symbol.for('#meta')].attributes[key].serialize = serialize;
        const _descriptor = {
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable,
          writable: descriptor.writable
        };
        if (descriptor.value.constructor.name === 'Function') {
          _descriptor.value = descriptor.value();
        }
        Reflect.defineProperty(this, key, _descriptor);
      }
    };
  };
};
