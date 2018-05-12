import { relation } from './';

const load = async (value, meta, id) => {
  meta.relatedId = id;
  return await meta.store.query({[meta.reversedKey]: meta.relatedId});
};

export default (modelName, reversedKey) => {
  return relation(modelName, load, reversedKey);
};
