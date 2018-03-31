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
        this.draw(ctx, x, y, this.sprites[0]);
        yield;
      }
    }
    this.clear(ctx, {x, y});
    this.draw(ctx, endX, endY, this.sprites[0]);
    yield;
  }

  *moveGeneratorFactory(ctx) {
    this.__moveLock = true;
    let fromCell = this.oldCell;
    let toCell = this.cell;

    if (fromCell == null) {
      toCell.isEmpty = false;
      yield* this.animate(ctx, toCell, toCell, 0);
    } else {
      const path = this.scene.findPath(fromCell, toCell);
      if (path.length === 0) this.cell = this.oldCell;
      for (const nextCell of path) {
        if (!nextCell.isEmpty) {
          this.cell = fromCell;
          break;
        }
        fromCell.isEmpty = true;
        nextCell.isEmpty = false;
        yield* this.animate(ctx, fromCell, nextCell, 4);
        fromCell = nextCell;
      }
    }
    this.needRender = false;
    this.__moveLock = false;
  }

  render(ctx) {
    if (this.moveGenerator == null)
      this.moveGenerator = this.moveGeneratorFactory(ctx);
    const {done} = this.moveGenerator.next();
    if (done) this.moveGenerator = null;
  }

  clear(ctx, {x, y} = {}) {
    if (x == null || y == null) return;
    ctx.globalCompositeOperation = 'destination-out';
    this.draw(ctx, x, y, this.sprites[0]);
    ctx.globalCompositeOperation = 'source-over';
  }
}
