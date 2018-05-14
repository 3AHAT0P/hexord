export default <T>(target: T, key: keyof T, descriptor?: TypedPropertyDescriptor<T>) => {
  if (descriptor == null) return;
  const cache: {value: any} = {value: null};
  Reflect.defineMetadata(`cache:${key}`, cache, target);
  return {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    get() {
      if (cache.value != null) return cache.value;
      return cache.value = descriptor.get.call(this);
    },
    set(value: any) {
      return cache.value = descriptor.set.call(this, value);
    },
  };
};
