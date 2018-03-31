import { bind } from '../../lib/decorators';
import { randomBetween } from '../../lib/utils';

import { AbsctractDynamicObject } from './';

export default class AiActor extends AbsctractDynamicObject {

  @bind
  _init() {
    setInterval(this.walk, 100);
  }

  @bind
  walk() {
    const cells = this.scene.getNearblyEmptyCells(this.cell);
    const cell = cells[0, randomBetween(0, cells.length)];
    if (cell == null) return;
    this.move(cell);
  }
}
