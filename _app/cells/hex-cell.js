import { bind } from '../../lib/decorators';

import { HexPathPoint } from '../points';

export default class HexCell {
  layers = new Map();
  slot = null;
  isHovered = false;
  needRender = true;

  get id() {
    return `${this.rowId}:${this.columnId}`;
  }

  get isEmpty() {
    return this.slot == null;
  }

  get cubeCoords() {
    const x = this.columnId - (this.rowId + (this.rowId & 1)) / 2;
    const z = this.rowId;
    const y = -1 * (x + z);
    return {x, y, z};
  }

  get sprite() {
    let ctx = this.buildCtx(this.width, this.height);
    for (const [, {delegate, args}] of this.layers) delegate(ctx, ...args);
    return this.buildBitmap(ctx);
  }

  constructor(rowId, columnId, position, options, parent) {
    this.rowId = rowId;
    this.columnId = columnId;
    this.position = position;
    this.height = options.height;
    this.width = options.width;
    this.background = options.clearColor;
    this.borderSize = options.border;
    this.borderColor = options.borderColor;
    this.hoverColor = options.hoverColor;
    this.edgeLength = options.edgeLength;
    this.parent = parent;

    this.addLayer('background', false, this.renderBackground);
    this.addLayer('border', false, this.renderBorder);
    this.addLayer('id', false, this.renderId);
  }

  isEqualTo(cell) {
    return this.rowId === cell.rowId && this.columnId === cell.columnId;
  }

  buildPathPoint(prevPoint = null) {
    return new HexPathPoint(this, this.moveCost, prevPoint);
  }

  enter(object) {
    if (this.isEmpty) {
      this.slot = object;
      return true;
    }
    return false;
  }

  leave(object) {
    if (this.slot === object) {
      this.slot = null;
      return true;
    }
    return false;
  }

  removeLayer(name, needRender=true) {
    this.layers.delete(name);
    if (needRender) this.needRender = true;
  }

  addLayer(name, needRender=true, delegate, ...args) {
    this.layers.set(name, {delegate, args});
    if (needRender) this.needRender = true;
  }

  hover(flag = true) {
    this.isHovered = flag;
    if (flag)
      this.addLayer('hover', true, this.renderHover);
    else
      this.removeLayer('hover');
  }

  async render(ctx) {
    if (!this.needRender) return;
    this.clear(ctx);
    for (const [, {delegate, args}] of this.layers) {
      delegate(ctx, this.position.x, this.position.y, ...args);
    }
    this.needRender = false;
  }

  buildCtx(width, height) {
    let canvas = new OffscreenCanvas(width, height);
    // let canvas = document.createElement('canvas');
    // canvas.width = this.width;
    // canvas.height = this.height;
    return canvas.getContext('2d');
  }

  buildBitmap(ctx) {
    return ctx.canvas.transferToImageBitmap();
    // return await createImageBitmap(ctx.canvas);
  }

  clear(ctx) {
    ctx.globalCompositeOperation = 'destination-out';
    this.fill(ctx, {x: this.position.x + this.width/2, y: this.position.y}, this.width, {
      color: this.background,
      borderSize: this.borderSize
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  @bind
  renderBackground (ctx) {
    return ctx;
  }

  @bind
  renderBorder (ctx, x=0, y=0) {
    this.fill(ctx, {x: x+this.width/2, y: y}, this.width, {
      color: this.borderColor,
      borderSize: this.borderSize
    });
    this.fill(ctx, {x: x+this.width/2, y: y+this.borderSize}, this.width - this.borderSize*2, {
      color: this.background,
      borderSize: this.borderSize,
      clear: true
    });
    return ctx;
  }

  @bind
  renderId (ctx, x=0, y=0) {
    let _fillStyle = ctx.fillStyle;
    ctx.fillStyle = 'hsla(0, 0%, 0%, .6)';
    let text = ctx.measureText(`${this.rowId}:${this.columnId}`);
    ctx.fillText(`${this.rowId}:${this.columnId}`, x + this.width/2 - text.width/2, y + this.height/2 + this.borderSize);
    ctx.fillStyle = _fillStyle;
    return ctx;
  }

  @bind
  renderHover (ctx, x=0, y=0) {
    this.fill(ctx, {x: x+this.width/2, y: y+this.borderSize}, this.width - this.borderSize*2, {
      color: this.hoverColor,
      borderSize: this.borderSize
    });
    return ctx;
  }

  renderObjectIn(imageData, positionX, positionY) {
    const delegate = function (ctx, x=0, y=0, imageData, positionX, positionY) {
      let relativeX = 0;
      let relativeY = 0;
      switch (positionX) {
        case 'center':
          relativeX = this.width/2 - imageData.width/2;
          break;
        default:
          relativeX = 0;
      }
      switch (positionY) {
        case 'center':
          relativeY = this.height/2 - imageData.height/2 - this.borderSize;
          break;
        default:
          relativeY = 0;
      }
      ctx.drawImage(imageData, x + relativeX, y + relativeY);
      return ctx;
    };
    this.addLayer('hover1', true, delegate, imageData, positionX, positionY);
    this.render();
  }

  fill(ctx, {x, y}, width, options = {}) {
    let _fillStyle = ctx.fillStyle;
    ctx.fillStyle = options.color || 'red';
    y += options.borderSize || 0;
    if (options.clear)
      ctx.globalCompositeOperation = 'destination-out';
    let lineLength = Math.sqrt(width*width/3);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x+width/2, y+lineLength/2);
    ctx.lineTo(x+width/2, y+lineLength/2+lineLength);
    ctx.lineTo(x, y+lineLength/2+lineLength+lineLength/2);
    ctx.lineTo(x-width/2, y+lineLength/2+lineLength);
    ctx.lineTo(x-width/2, y+lineLength/2);
    ctx.lineTo(x, y);
    ctx.fill();
    ctx.closePath();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = _fillStyle;
  }

  getPositionX(localPosition) {
    let x = this.position.x; //+ this.borderSize
    switch (localPosition) {
      case 'center':
        return x + this.width/2;
      default:
        return x;
    }
  }

  getPositionY(localPosition) {
    let y = this.position.y; //+ this.borderSize
    switch (localPosition) {
      case 'center':
        return y + this.height/2;
      default:
        return y;
    }
  }
}
