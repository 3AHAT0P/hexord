import { stringAttr, numberAttr } from '../../lib/attrs';
import { inherit, inheritIn } from '../../lib/decorators';

import { AbstractModel } from './';

export default class ActionModel extends AbstractModel {

  @inherit(Object, 'attributes')
  _meta = {
    @inheritIn()
    attributes: {}
  };

  _data = {};

  @stringAttr()
  turnId = null;

  @stringAttr()
  subjectId = null;

  @numberAttr()
  cost = 0;

  @stringAttr()
  type = 'move';

  @stringAttr()
  pointFrom = null;  // `${rowId}:${columnId}`

  @stringAttr()
  pointTo = null;  // `${rowId}:${columnId}`
}
