import { hasManyRelation } from "../../../lib";

import { AbstractModel } from "./";

export default class TurnModel extends AbstractModel {

  protected _data: IHash = {};

  @hasManyRelation("ActionModel", "turnId")
  public actions: Promise<any[]> = null;
}
