import { stringAttr } from '../../lib/attrs';
import { uuid } from '../../lib/utils';

export default class AbstractModel {

  @stringAttr()
  id = uuid;

  constructor(data) {
    if (data.id != null) this.id = data.id;

    this.deserialize(data);
  }

  deserialize(data) {
    for (const [key, {deserialize}] of Object.entries(this[Symbol.for('#meta')].attributes)) {
      this[key] = this._data[key] = deserialize(data[key], this[Symbol.for('#meta')].attributes[key]);
    }
    return this;
  }

  serialize() {
    const data = {};
    for (const [key, {serialize}] of Object.entries(this[Symbol.for('#meta')].attributes)) {
      data[key] = this._data[key] = serialize(this[key], this[Symbol.for('#meta')].attributes[key]);
    }
    return data;
  }

}
