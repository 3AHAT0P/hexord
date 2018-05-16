import { inject } from "../";

type loadFunction = (value: any, meta: IRelation, id?: string) => Promise<any>;

export interface IRelation {
  relatedId?: string;
  relatedKey: string;
  reversedKey: string;
  store?: any; // AbstractStore
  load: loadFunction;
}

export default (modelName: string, load: loadFunction, reversedKey?: string) => {
  return (target: any, key: string, descriptor?: PropertyDescriptor) => {
    const relation: IRelation = {
      load,
      relatedKey: `${key}Id`,
      reversedKey,
    };
    Reflect.defineMetadata(`relation:${key}`, relation, target);
    const configurable = descriptor == null ? false : descriptor.configurable;
    const enumerable = descriptor == null ? true : descriptor.enumerable;
    const _descriptor: PropertyDescriptor = {
      configurable, enumerable,
      get() {
        if (relation.store == null) relation.store = inject(modelName.replace("Model", "Store"));
        return new Promise(async (resolve, reject) => {
          try {
            const result = await relation.load(this[relation.relatedKey], relation, this.id);
            resolve(result);
            return result;
          } catch (error) {
            reject(error);
            return null;
          }
        });
      },
    };
    Reflect.defineProperty(target, key, _descriptor);
  };
};
