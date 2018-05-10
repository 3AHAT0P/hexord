import { stringAttr, numberAttr } from '../../lib/attrs';
import { hasOneRelation } from '../../lib/relations';
import { inherit, inheritIn } from '../../lib/decorators';

import AbstractModel from './abstract';

export default class ActionModel extends AbstractModel {

  @inherit(Object, 'attributes')
  _meta = {
    @inheritIn()
    attributes: {}
  };

  _data = {};

  @stringAttr()
  turnId = null;

  @hasOneRelation('TurnModel')
  turn = null;

  @stringAttr()
  subjectId = null;

  @hasOneRelation('SubjectModel')
  subject = null;

  @numberAttr()
  cost = 0;

  @stringAttr()
  type = 'move';

  @stringAttr()
  pointFrom = null;  // `${rowId}:${columnId}`

  @stringAttr()
  pointTo = null;  // `${rowId}:${columnId}`
}
