import { bind } from '../../lib/decorators';

import { RenderedObject } from '../';

export default class AbsctractDynamicObject extends RenderedObject {
  moveGenerator = null;
  __moveLock = false;

  @bind
  move(newCell) {
    if (this.__moveLock) return;
    this.oldCell = this.cell;
    this.cell = newCell;
    this.needRender = true;
  }

  *animate(ctx, from, to, stepCount = 1) {
    let [x, y] = this._buildCoordinates(from);
    const [endX, endY] = this._buildCoordinates(to);
    const dX = (endX - x) / stepCount;
    const dY = (endY - y) / stepCount;
    if (dX !== 0 || dY !== 0) {
      for (let i = 0; i < stepCount - 1; ++i) {
        this.clear(ctx, {x, y});
        x += dX;
        y += dY;
        this.draw(ctx, x, y, this.sprites.main);
        yield;
      }
    }
    this.clear(ctx, {x, y});
    this.draw(ctx, endX, endY, this.sprites.main);
  }

  *moveGeneratorFactory(ctx) {
    this.__moveLock = true;
    let fromCell = this.oldCell;
    let toCell = this.cell;

    if (fromCell == null) {
      this.enter(toCell);
      yield* this.animate(ctx, toCell, toCell, 0);
    } else {
      const path = this.scene.findPath(fromCell, toCell);
      if (path.length === 0) this.cell = this.oldCell;
      for (const nextCell of path) {
        if (!this.enter(nextCell)) {
          this.cell = fromCell;
          break;
        }
        this.leave(fromCell);
        yield* this.animate(ctx, fromCell, nextCell, 4);
        fromCell = nextCell;
      }
    }
    this.needRender = false;
    this.__moveLock = false;
  }

  enter(cell) {
    return cell.enter(this);
  }

  leave(cell) {
    return cell.leave(this);
  }

  render(ctx) {
    if (!this.needRender) {
      this.clear(ctx, ...this._buildCoordinates(this.cell));
      this.draw(ctx, ...this._buildCoordinates(this.cell), this.sprites.main);
      return;
    }
    if (this.moveGenerator == null)
      this.moveGenerator = this.moveGeneratorFactory(ctx);
    const {done} = this.moveGenerator.next();
    if (done) this.moveGenerator = null;
  }

  clear(ctx, {x, y} = {}) {
    // if (x == null || y == null) return;
    // ctx.globalCompositeOperation = 'destination-out';
    // this.draw(ctx, x-2, y-2, this.sprites.clear || this.sprites.main);
    // ctx.globalCompositeOperation = 'source-over';
  }
}
