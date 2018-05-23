import { WolfModel } from "../models";

import { SubjectStore } from "./";

export default class WolfStore extends SubjectStore {

  protected _cache: Map<string, WolfModel> = new Map<string, WolfModel>();

  public async getOne(id: string, options?: any): Promise<WolfModel> {
    return this._cache.get(id);
  }

  public async getMany(ids: string[], options?: any): Promise<WolfModel[]> {
    return ids.map((id) => this._cache.get(id)).filter((item) => item != null);
  }

  public async getAll(options?: any): Promise<WolfModel[]> {
    return Array.from(this._cache.values());
  }

  public async query(queryObject: any, options?: any): Promise<WolfModel[]> {
    // @TODO improve this;
    const result = [];

    for (const item of this._cache.values()) {
      let isValid = true;
      for (const [key, value] of Object.entries(queryObject)) {
        if (item[key] !== value) {
          isValid = false;
          break;
        }
      }
      if (isValid) result.push(item);
    }

    return result;
  }

  public async createOne(data: any, options?: any): Promise<WolfModel> {
    const record = new WolfModel();
    await record.deserialize(data);
    this._cache.set(record.id, record);
    return record;
  }

  public async updateOne(data: any, options?: any): Promise<WolfModel> {
    throw new Error("Not implemented!");
  }
}
