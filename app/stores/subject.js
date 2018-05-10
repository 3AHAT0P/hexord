import { AbstractStore } from './';

import { SubjectModel } from '../models';

const cache = new Map();

export default class SubjectStore extends AbstractStore {

  async getOne(id) {
    return cache.get(id);
  }

  async getMany(ids) {
    return ids.map((id) => cache.get(id)).filter((item) => item != null);
  }

  async getAll() {
    return Array.from(cache.values());
  }

  async query(queryObject) {
    // @TODO improve this;
    return Array.from(cache.values()).filter((item) => {
      for (const [key, value] of Object.entries(queryObject))
        if (item[key] !== value) return false;
      return true;
    });
  }

  async createOne(data) {
    const record = new SubjectModel();
    await record.deserialize(data);
    cache.set(record.id, record);
    return record;
  }

  async updateOne() {
    throw new Error('Not implemented!');
  }
}
