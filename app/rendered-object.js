import { next } from '../lib/utils';
import { bind } from '../lib/decorators';

export default class RenderedObject {
  needRender = true;
  needClear = false;
  canInteract = new Map();

  get ctx() {
    return this._ctx;
  }

  set ctx(ctx) {
    return this._ctx = ctx;
  }

  @bind
  _init() {}

  _buildCoordinates(cell) {
    let x = 0;
    let y = 0;
    if (this.positionX.constructor.name === 'String') {
      switch (this.positionX) {
        case 'left':
          x = cell.getPositionX('left');
          break;
        case 'center':
          // if (this.width > cell.width) {}
          x = cell.getPositionX('center') - this.width / 2;
          break;
        case 'right':
          x = cell.getPositionX('right') - this.width;
          break;
      }
    } else if (this.positionX.constructor.name === 'Number') {
      x = cell.getPositionX('top') + this.positionX;
    } else {
      x = cell.getPositionX('top');
    }
    if (this.positionY.constructor.name === 'String') {
      switch (this.positionY) {
        case 'top':
          y = cell.getPositionY('top');
          break;
        case 'center':
          if (this.height > cell.height) {
            y = cell.getPositionY('center') - this.height + cell.height/8;
          } else {
            y = cell.getPositionY('center') - this.height / 2;
          }
          break;
        case 'bottom':
          y = cell.getPositionY('bottom') - this.height;
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
    this.width = sprites.main.width;
    this.height = sprites.main.height;
    this.cell = cell;

    next(this._init);
  }

  interact(actionName, actionType) {

  }

  render() {
    if (this.needClear) {
      this.clear(...this._buildCoordinates(this.cell));
      this.needClear = false;
      this.needRender = false;
      return;
    }
    this.draw(...this._buildCoordinates(this.cell), this.sprites.main);
    this.needRender = false;
  }

  draw(x, y, sprite) {
    this.ctx.drawImage(sprite, x, y);
  }

  clear({x, y} = {}) {
    if (x == null || y == null) {
      [x, y] = this._buildCoordinates(this.cell);
    }
    this.ctx.globalCompositeOperation = 'destination-out';
    this.draw(x-2, y-2, this.sprites.clear || this.sprites.main);
    this.ctx.globalCompositeOperation = 'source-over';
  }
}
