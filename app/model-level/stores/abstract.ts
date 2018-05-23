import { AbstractModel } from "../models";

export default class AbstractStore {

  protected _cache: Map<string, AbstractModel>;

  public async getOne(id: string, options?: any): Promise<AbstractModel> {
    throw new Error("Not implemented!");
  }

  public async getMany(ids: string[], options?: any): Promise<AbstractModel[]> {
    throw new Error("Not implemented!");
  }

  public async getAll(options?: any): Promise<AbstractModel[]> {
    throw new Error("Not implemented!");
  }

  public async query(queryObject: any, options?: any): Promise<AbstractModel[]> {
    throw new Error("Not implemented!");
  }

  public async createOne(data: any, options?: any): Promise<AbstractModel> {
    throw new Error("Not implemented!");
  }

  public async updateOne(data: any, options?: any): Promise<AbstractModel> {
    throw new Error("Not implemented!");
  }
}
