export default (target, key, descriptor) => {
  return {
    enumerable: descriptor.enumerable,
    configurable: true,
    get: () => {
      const _descriptor = {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
      };
      if (descriptor.value != null) {
        _descriptor.writable = descriptor.writable;
        if (descriptor.value.constructor.name === 'Function') {
          _descriptor.value = descriptor.value.call(this);
        } else {
          _descriptor.value = descriptor.value;
        }
      } else {
        _descriptor.get = () => {
          if (this[Symbol.for('#meta')][key] != null) {
            if (this[Symbol.for('#meta')][key].cached != null) {
              return this[Symbol.for('#meta')][key].cached;
            }
          } else {
            this[Symbol.for('#meta')][key] = {};
          }
          return this[Symbol.for('#meta')][key].cached = descriptor.get.call(this);
        };

        _descriptor.set = (value) => {
          if (this[Symbol.for('#meta')][key] == null) {
            this[Symbol.for('#meta')][key] = {};
          }
          return this[Symbol.for('#meta')][key].cached = descriptor.set.call(this, value);
        };
      }
      Reflect.defineProperty(this, key, _descriptor);
    }
  };
};
