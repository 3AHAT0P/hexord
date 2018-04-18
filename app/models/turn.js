import { hasManyRelation } from '../../lib/relations';

import { AbstractModel, ActionModel } from './';

export default class TurnModel extends AbstractModel {

  @hasManyRelation(ActionModel)
  actions: [];

  addAction() {

  }
}
