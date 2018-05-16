export interface IAttribute {
  deserialize: (value: any, meta: IAttribute, id?: string) => any;
  serialize: (value: any, meta: IAttribute) => any;
}

// tslint:disable-next-line:max-line-length
export default (deserialize: (value: any, meta: IAttribute, id?: string) => any, serialize: (value: any, meta: IAttribute) => any) => {
  return <T>(target: T, key: keyof T, descriptor?: PropertyDescriptor) => {
    const attribute: IAttribute = { deserialize, serialize};
    Reflect.defineMetadata(`attribute:${key}`, attribute, target);
    return descriptor as any;
  };
};
