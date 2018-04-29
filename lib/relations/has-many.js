import { relation } from './';

const deserialize = async (value, meta, id) => {
  meta.relatedId = id;
  return await meta.store.query({[meta.reversedKey]: meta.relatedId});
};

export default (ModelClass, reversedKey) => {
  return relation(ModelClass, deserialize, () => void 0, reversedKey);
};
