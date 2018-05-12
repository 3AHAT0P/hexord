import { AbstractStore } from './';

import { WolfModel } from '../models';

export default class WolfStore extends AbstractStore {

  async getOne(id) {
    return new WolfModel({id});
  }

  async getMany(ids) {
    return ids.map((id) => new WolfModel({id}));
  }

  async getAll() {
    throw new Error('Not implemented!');
  }

  async createOne() {
    throw new Error('Not implemented!');
  }

  async updateOne() {
    throw new Error('Not implemented!');
  }
}
