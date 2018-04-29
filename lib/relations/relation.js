export default (ModelClass, deserialize, serialize, reversedKey) => {
  return (target, key, descriptor) => {
    if (target._meta.attributes[key] == null) target._meta.attributes[key] = {};
    target._meta.attributes[key].deserialize = deserialize;
    target._meta.attributes[key].serialize = serialize;
    target._meta.attributes[key].relatedKey = key.replace(/Id$/i, '');
    target._meta.attributes[key].reversedKey = reversedKey;
    return {
      ...descriptor,
      initializer() {
        target._meta.attributes[key].store = ModelClass.getStore();
        return descriptor.value || (descriptor.initializer && descriptor.initializer.call(this)) || null;
      }
    };
  };
};
