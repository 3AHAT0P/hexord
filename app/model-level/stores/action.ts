import { ActionModel } from "../models";

import { default as AbstractStore } from "./abstract";

export default class ActionStore extends AbstractStore {

  protected _cache: Map<string, ActionModel> = new Map<string, ActionModel>();

  public async getOne(id: string, options?: any): Promise<ActionModel> {
    return this._cache.get(id);
  }

  public async getMany(ids: string[], options?: any): Promise<ActionModel[]> {
    return ids.map((id) => this._cache.get(id)).filter((item) => item != null);
  }

  public async getAll(options?: any): Promise<ActionModel[]> {
    return Array.from(this._cache.values());
  }

  public async query(queryObject: any, options?: any): Promise<ActionModel[]> {
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

  public async createOne(data: any, options?: any): Promise<ActionModel> {
    const record = new ActionModel();
    await record.deserialize(data);
    this._cache.set(record.id, record);
    return record;
  }

  public async updateOne(data: any, options?: any): Promise<ActionModel> {
    throw new Error("Not implemented!");
  }
}
