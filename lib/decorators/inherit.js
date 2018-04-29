export default (Class = Object, ...props) => {
  return (target, key, descriptor = {}) => {
    const value = descriptor.value || (descriptor.initializer && descriptor.initializer()) || new Class();
    const proto = Reflect.getPrototypeOf(target);
    if (proto.hasOwnProperty(key)) Reflect.setPrototypeOf(value, proto[key]);
    for (const propKey of props) {
      const meta = value[propKey];
      const _value = meta.descriptor.value || (meta.descriptor.initializer && meta.descriptor.initializer()) || new meta.Class();
      if (proto[key] && proto[key].hasOwnProperty(propKey)) Reflect.setPrototypeOf(_value, proto[key][propKey]);
      Reflect.defineProperty(value, propKey, {...meta.descriptor, value: _value});
    }
    Reflect.defineProperty(target, key, {...descriptor, value});
    return {
      ...descriptor,
      initializer() {
        const value = new Class();
        Reflect.setPrototypeOf(value, target[key]);
        return value;
      }
    };
  };
};
