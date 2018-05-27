import { AbstractModel } from '../models';

export default abstract class AbstractStore {

  protected _cache: Map<string, AbstractModel>;

  public abstract async getOne(id: string, options?: any): Promise<AbstractModel>;

  public abstract async getMany(ids: string[], options?: any): Promise<AbstractModel[]>;

  public abstract async getAll(options?: any): Promise<AbstractModel[]>;

  public abstract async query(queryObject: any, options?: any): Promise<AbstractModel[]>;

  public abstract async createOne(data: any, options?: any): Promise<AbstractModel>;

  public abstract async updateOne(data: any, options?: any): Promise<AbstractModel>;
}
