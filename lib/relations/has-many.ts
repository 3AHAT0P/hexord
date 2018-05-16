import { IRelation, relation } from "./";

const load = async (value: any, meta: IRelation, id: string) => {
  meta.relatedId = id;
  return await meta.store.query({[meta.reversedKey]: meta.relatedId});
};

export default (modelName: string, reversedKey?: string) => {
  return relation(modelName, load, reversedKey);
};
