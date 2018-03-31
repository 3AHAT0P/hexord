import { next } from '../lib/utils';
import { bind } from '../lib/decorators';

export default class RenderedObject {
  needRender = true;

  @bind
  _init() {}

  _buildCoordinates(cell) {
    let x = 0;
    let y = 0;
    if (this.positionX.constructor.name === 'String') {
      switch (this.positionX) {
        case 'top':
          x = cell.getPositionX('top');
          break;
        case 'center':
          x = cell.getPositionX('center') - this.width / 2;
          break;
        case 'bottom':
          x = cell.getPositionX('bottom') - this.width;
          break;
      }
    } else if (this.positionX.constructor.name === 'Number') {
      x = cell.getPositionX('top') + this.positionX;
    } else {
      x = cell.getPositionX('top');
    }
    if (this.positionY.constructor.name === 'String') {
      switch (this.positionY) {
        case 'left':
          y = cell.getPositionY('left');
          break;
        case 'center':
          y = cell.getPositionY('center') - this.height / 2;
          break;
        case 'bottom':
          y = cell.getPositionY('right') - this.height;
          break;
      }
    } else if (this.positionY.constructor.name === 'Number') {
      y = cell.getPositionY('left') + this.positionY;
    } else {
      y = cell.getPositionY('left');
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

    next(this._init);
  }

  render(ctx) {
    this.draw(ctx, ...this._buildCoordinates(this.cell), this.sprites[0]);
    this.needRender = false;
  }

  draw(ctx, x, y, sprite) {
    ctx.drawImage(sprite, x, y);
  }
}
