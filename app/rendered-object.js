import { inject, next, nextFrame } from '../lib/utils';
import { bind } from '../lib/decorators';

export default class RenderedObject {

  @bind
  _init() {}

  _buildCoordinates() {
    let x = 0;
    let y = 0;
    if (this.positionX.constructor.name === 'String') {
      switch (this.positionX) {
        case 'top':
          x = this.cell.getPositionX('top');
          break;
        case 'center':
          x = this.cell.getPositionX('center') - this.width / 2;
          break;
        case 'bottom':
          x = this.cell.getPositionX('bottom') - this.width;
          break;
      }
    } else if (this.positionX.constructor.name === 'Number') {
      x = this.cell.getPositionX('top') + this.positionX;
    } else {
      x = this.cell.getPositionX('top');
    }
    if (this.positionY.constructor.name === 'String') {
      switch (this.positionY) {
        case 'left':
          y = this.cell.getPositionY('left');
          break;
        case 'center':
          y = this.cell.getPositionY('center') - this.height / 2;
          break;
        case 'bottom':
          y = this.cell.getPositionY('right') - this.height;
          break;
      }
    } else if (this.positionY.constructor.name === 'Number') {
      y = this.cell.getPositionY('left') + this.positionY;
    } else {
      y = this.cell.getPositionY('left');
    }
    return [x, y];
  }

  // sprite should have type ImageBitmap
  constructor(scene, {x, y}, sprites, cell) {
    this.scene = scene;
    this.positionX = x;
    this.positionY = y;
    this.sprites = sprites;
    this.width = sprites[0].width;
    this.height = sprites[0].height;
    this.cell = cell;

    this.needRender = true;
    next(this._init);
  }

  render(ctx) {
    this.draw(ctx, ...this._buildCoordinates(), this.sprites[0]);
    this.needRender = false;
  }

  draw(ctx, x, y, sprite, options = {}) {
    ctx.drawImage(sprite, x, y);
  }
}
