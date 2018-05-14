export default <T>(target: T, key: keyof T, descriptor?: PropertyDescriptor) => {
  if (descriptor == null) return;
  if (
    descriptor.value == null ||
    ["Function", "AsyncFunction"].indexOf(descriptor.value.constructor.name) === -1
  ) return descriptor;
  return {
    configurable: true,
    enumerable: descriptor.enumerable,
    get() {
      const value = descriptor.value.bind(this);
      Reflect.defineProperty(this, key, {...descriptor, value});
      return value;
    },
  };
};
