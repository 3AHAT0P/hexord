import { relation } from './';

const load = async (value, meta) => {
  return await meta.store.getOne(value);
};

export default (modelName, reversedKey) => {
  return relation(modelName, load, reversedKey);
};
