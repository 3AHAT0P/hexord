export default (deserialize, serialize) => {
  return (target, key, descriptor) => {
    if (target._meta.attributes[key] == null) target._meta.attributes[key] = {};
    target._meta.attributes[key].deserialize = deserialize;
    target._meta.attributes[key].serialize = serialize;
    return descriptor;
  };
};
