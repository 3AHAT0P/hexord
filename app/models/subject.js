import { stringAttr, numberAttr } from '../../lib/attrs';
import { inherit, inheritIn } from '../../lib/decorators';

import { AbstractModel } from './';

export default class SubjectModel extends AbstractModel {

  @inherit(Object, 'attributes')
  _meta = {
    @inheritIn()
    attributes: {}
  };

  _data = {};

  @stringAttr()
  name = null;

  @numberAttr()
  strength = 0;

  @numberAttr()
  constitution = 0;

  @numberAttr()
  dexterity = 0;

  @numberAttr()
  intelligence = 0;

  @numberAttr()
  perception = 0;

  @numberAttr()
  luck = 0;

  get hitPoints() {
    return this.constitution * 3;
  }

  get actionPoints() {
    return this.dexterity + 10;
  }

  get damage() {
    return this.strength;
  }
}
