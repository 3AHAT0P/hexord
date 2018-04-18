import { stringAttr, numberAttr } from '../../lib/attrs';

import { AbstractModel } from './';

export default class ActionModel extends AbstractModel {
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
