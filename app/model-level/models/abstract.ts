import {
  uuid, inject, next, entries,
  bind,
  IAttribute, stringAttr,
  IRelation,
} from "../../../lib";

export default class AbstractModel {

  [key: string]: any;

  public static get storeName() {
    return this.name.replace("Model", "Store");
  }

  public static getStore() {
    return inject(this.storeName);
  }

  public static *getAttributesMeta(instance: AbstractModel): IterableIterator<[string, IAttribute]> {
    const metaKeys = Reflect.getMetadataKeys(instance);
    for (const metaKey of metaKeys) {
      const matches = /^attribute\:([\w\d]*)$/i.exec(metaKey);
      if (matches != null) {
        const key = matches[1];
        yield [key, Reflect.getMetadata(`attribute:${key}`, instance)];
      }
    }
  }

  public static *getRelationsMeta(instance: AbstractModel): IterableIterator<[string, IRelation]> {
    const metaKeys = Reflect.getMetadataKeys(instance);
    for (const metaKey of metaKeys) {
      const matches = /^relation\:([\w\d]*)$/i.exec(metaKey);
      if (matches != null) {
        const key = matches[1];
        yield [key, Reflect.getMetadata(`relation:${key}`, instance)];
      }
    }
  }

  protected _data: IHash = {};

  @stringAttr()
  public id: string = uuid();

  @bind
  public async deserialize(data: any) {
    for (const [key, meta] of AbstractModel.getAttributesMeta(this)) {
      if (key === "id" && data.id == null) continue;
      this[key] = this._data[key] = await meta.deserialize(data[key], meta, this.id);
    }
    return this;
  }

  @bind
  public async serialize() {
    const data: IHash = {};
    for (const [key, meta] of AbstractModel.getAttributesMeta(this)) {
      data[key] = this._data[key] = await meta.serialize(this[key], meta);
    }
    return data;
  }

}
