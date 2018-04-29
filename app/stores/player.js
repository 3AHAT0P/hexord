import { AbstractStore } from './';

import { PlayerModel } from '../models';

export default class PlayerStore extends AbstractStore {

  async getOne(id) {
    return new PlayerModel({id});
  }

  async getMany(ids) {
    return ids.map((id) => new PlayerModel({id}));
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
