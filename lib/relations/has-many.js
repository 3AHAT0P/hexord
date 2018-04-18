import { relation } from './';

const deserialize = async (value, meta) => {
  return await meta.store.getMany(meta.relatedId);
};

export default (ModelClass) => {
  return relation(ModelClass, deserialize, () => void 0);
};
