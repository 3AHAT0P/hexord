import { stringAttr } from '../../lib/attrs';
import { UUID, inject, next, entries } from '../../lib/utils';
import { bind, inherit, inheritIn } from '../../lib/decorators';

export default class AbstractModel {

  static get storeName() {
    return this.name.replace('Model', 'Store');
  }

  static getStore() {
    return inject(this.storeName);
  }

  @inherit(Object, 'attributes')
  _meta = {
    @inheritIn()
    attributes: {}
  };

  _data = {};

  @stringAttr()
  id = UUID();

  constructor() {
  }

  @bind
  async deserialize(data) {
    for (const [key, {deserialize}] of entries(this._meta.attributes)) {
      if (key === 'id' && data.id == null) continue;
      this[key] = this._data[key] = await deserialize(data[key], this._meta.attributes[key], this.id);
    }
    return this;
  }

  serialize() {
    const data = {};
    for (const [key, {serialize}] of entries(this._meta.attributes)) {
      data[key] = this._data[key] = serialize(this[key], this._meta.attributes[key]);
    }
    return data;
  }

}
