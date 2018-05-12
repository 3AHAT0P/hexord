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

  @numberAttr()
  hitPointNumber = 0;

  @numberAttr()
  actionPointNumber = 0;

  @numberAttr()
  damage = 0;

  get maxHitPointNumber() {
    return this.constitution * 3;
  }

  get maxActionPointNumber() {
    return this.dexterity + 10;
  }

  get maxDamage() {
    return this.strength;
  }
}
