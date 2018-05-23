import { SubjectModel } from "../models";

import { AbstractStore } from "./";

export default class SubjectStore extends AbstractStore {

  protected _cache: Map<string, SubjectModel> = new Map<string, SubjectModel>();

  public async getOne(id: string, options?: any): Promise<SubjectModel> {
    return this._cache.get(id);
  }

  public async getMany(ids: string[], options?: any): Promise<SubjectModel[]> {
    return ids.map((id) => this._cache.get(id)).filter((item) => item != null);
  }

  public async getAll(options?: any): Promise<SubjectModel[]> {
    return Array.from(this._cache.values());
  }

  public async query(queryObject: any, options?: any): Promise<SubjectModel[]> {
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

  public async createOne(data: any, options?: any): Promise<SubjectModel> {
    const record = new SubjectModel();
    await record.deserialize(data);
    this._cache.set(record.id, record);
    return record;
  }

  public async updateOne(data: any, options?: any): Promise<SubjectModel> {
    throw new Error("Not implemented!");
  }
}
