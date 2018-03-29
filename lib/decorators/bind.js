export default (target, key, descriptor) => {
  if (descriptor.value == null || ['Function', 'AsyncFunction'].indexOf(descriptor.value.constructor.name) === -1 ) return descriptor;
  return {
    configurable: true,
    enumerable: false,
    get: function() {
      descriptor.value = descriptor.value.bind(this);
      Reflect.defineProperty(this, key, descriptor);
      return descriptor.value;
    }
  }
}
