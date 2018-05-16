import {
  stringAttr, numberAttr,
  hasOneRelation,
} from "../../../lib";

import { AbstractModel } from "./";

export default class ActionModel extends AbstractModel {

  protected _data = {};

  @stringAttr()
  public turnId: string = null;

  @hasOneRelation("TurnModel")
  public turn: Promise<any> = null;
  // public turn: Promise<TurnModel> = null;

  @stringAttr()
  public subjectId: string = null;

  @hasOneRelation("SubjectModel")
  public subject: Promise<any> = null;

  @numberAttr()
  public cost: number = 0;

  @stringAttr()
  public type: string = "move";

  @stringAttr()
  public pointFrom: string = null;  // `${rowId}:${columnId}`

  @stringAttr()
  public pointTo: string = null;  // `${rowId}:${columnId}`
}
