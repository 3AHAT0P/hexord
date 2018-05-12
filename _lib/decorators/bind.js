export default (target, key, descriptor) => {
  if (descriptor.value == null || ['Function', 'AsyncFunction'].indexOf(descriptor.value.constructor.name) === -1 ) return descriptor;
  return {
    configurable: true,
    enumerable: false,
    get: function() {
      const value = descriptor.value.bind(this);
      Reflect.defineProperty(this, key, {...descriptor, value});
      return value;
    },
  };
};
