import { stringAttr, numberAttr } from "../../../lib";

import { AbstractModel } from "./";

export default class SubjectModel extends AbstractModel {

  protected _data: IHash = {};

  @stringAttr()
  public name: string = null;

  @numberAttr()
  public strength: number = 0;

  @numberAttr()
  public constitution: number = 0;

  @numberAttr()
  public dexterity: number = 0;

  @numberAttr()
  public intelligence: number = 0;

  @numberAttr()
  public perception: number = 0;

  @numberAttr()
  public luck: number = 0;

  @numberAttr()
  public hitPointNumber: number = 0;

  @numberAttr()
  public maxHitPointNumber: number = 0;

  @numberAttr()
  public actionPointNumber: number = 0;

  @numberAttr()
  public maxActionPointNumber: number = 0;

  @numberAttr()
  public damage: number = 0;

  @numberAttr()
  public maxDamage: number = 0;

  // get maxHitPointNumber() {
  //   return this.constitution * 3;
  // }

  // get maxActionPointNumber() {
  //   return this.dexterity + 10;
  // }

  // get maxDamage() {
  //   return this.strength;
  // }
}
