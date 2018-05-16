import { IRelation, relation } from "./";

const load = async (value: any, meta: IRelation) => {
  return await meta.store.getOne(value);
};

export default (modelName: string, reversedKey?: string) => {
  return relation(modelName, load, reversedKey);
};
