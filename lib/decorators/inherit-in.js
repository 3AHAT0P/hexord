export default (Class = Object) => {
  return (target, key, descriptor = {}) => {
    return {
      enumerable: descriptor.enumerable,
      configurable: true,
      value: {Class, descriptor}
    };
  };
};
