import { hasManyRelation } from '../../lib/relations';
import { inherit, inheritIn } from '../../lib/decorators';

import { AbstractModel, ActionModel } from './';

export default class TurnModel extends AbstractModel {

  @inherit(Object, 'attributes')
  _meta = {
    @inheritIn()
    attributes: {}
  };

  _data = {};

  @hasManyRelation(ActionModel, 'turnId')
  actions = [];

  addAction() {

  }
}
