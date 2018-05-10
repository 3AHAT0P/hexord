import { inject } from '../utils';

export default (modelName, load, reversedKey) => {
  return (target, key, descriptor) => {
    if (target._meta.attributes[key] == null) target._meta.attributes[key] = {};
    const meta = target._meta.attributes[key];
    meta.deserialize = null;
    meta.serialize = null;
    meta.relatedKey = `${key}Id`;
    meta.reversedKey = reversedKey;
    return {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      get() {
        if (meta.store == null) meta.store = inject(modelName.replace('Model', 'Store'));
        return new Promise(async (resolve, reject) => {
          try {
            const result = await load(this[meta.relatedKey], meta, this.id);
            resolve(result);
            return result;
          } catch (error) {
            reject(error);
            return null;
          }
        });
      }
    };
  };
};
