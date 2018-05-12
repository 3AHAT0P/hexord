import { bind } from '../../lib/decorators';

import { AbsctractDynamicObject } from './';

export default class Player extends AbsctractDynamicObject {

  @bind
  _init() {
    this.scene.on('cellClicked', this.move);
  }
}
