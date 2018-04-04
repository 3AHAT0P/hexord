import { bind } from '../../lib/decorators';

import { AbstractLayer } from './';

export default class BackgroundLayer extends AbstractLayer {
  constructor(scene, width, height, backgroundSprite) {
    super(scene, width, height);
    this.backgroundSprite = backgroundSprite;
  }

  @bind
  prerender() {
    this.ctx.drawImage(this.backgroundSprite, 0, 0);
  }
}
