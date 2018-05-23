import { PlayerModel } from "../models";

import { AbstractStore } from "./";

export default class PlayerStore extends AbstractStore {

  protected _cache: Map<string, PlayerModel> = new Map<string, PlayerModel>();

  public async getOne(id: string, options?: any): Promise<PlayerModel> {
    return this._cache.get(id);
  }

  public async getMany(ids: string[], options?: any): Promise<PlayerModel[]> {
    return ids.map((id) => this._cache.get(id)).filter((item) => item != null);
  }

  public async getAll(options?: any): Promise<PlayerModel[]> {
    return Array.from(this._cache.values());
  }

  public async query(queryObject: any, options?: any): Promise<PlayerModel[]> {
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

  public async createOne(data: any, options?: any): Promise<PlayerModel> {
    const record = new PlayerModel();
    await record.deserialize(data);
    this._cache.set(record.id, record);
    return record;
  }

  public async updateOne(data: any, options?: any): Promise<PlayerModel> {
    throw new Error("Not implemented!");
  }
}
