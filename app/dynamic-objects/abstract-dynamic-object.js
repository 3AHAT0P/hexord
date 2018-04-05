import { bind } from '../../lib/decorators';

import { RenderedObject } from '../';
import { Box } from '../static-objects';

const tryIt = (cb, fallback) => {
  try {
    return cb();
  } catch (error) {
    return fallback;
  }
};

export default class AbsctractDynamicObject extends RenderedObject {
  moveGenerator = null;
  __moveLock = false;

  canInteractWith(object, type = 'all') {
    if (object == null) return false;
    for (const [, actionType] of object.canInteract) {
      if (actionType === type) {
        return true;
      }
    }
    return false;
  }

  interactWith(object, type = 'range') {
    for (const [actionName, actionType] of object.canInteract) {
      if (actionType === type) {
        return object.interact(actionName, actionType);
      }
    }
  }

  @bind
  move(newCell) {
    if (this.__moveLock) return;
    if (this.canInteractWith(newCell.slot, 'range')) {
      this.interactWith(newCell.slot, 'range');
      return;
    }
    this.oldCell = this.cell;
    this.cell = newCell;
    this.needRender = true;
  }

  *animate(from, to, stepCount = 1) {
    let [x, y] = this._buildCoordinates(from);
    const [endX, endY] = this._buildCoordinates(to);
    const dX = (endX - x) / stepCount;
    const dY = (endY - y) / stepCount;
    if (dX !== 0 || dY !== 0) {
      for (let i = 0; i < stepCount - 1; ++i) {
        this.clear({x, y});
        x += dX;
        y += dY;
        this.draw(x, y, this.sprites.main);
        yield;
      }
    }
    this.clear({x, y});
    this.draw(endX, endY, this.sprites.main);
  }

  *moveGeneratorFactory() {
    this.__moveLock = true;
    let fromCell = this.oldCell;
    let toCell = this.cell;

    if (fromCell == null) {
      this.enter(toCell);
      yield* this.animate(toCell, toCell, 0);
    } else {
      const path = this.scene.findPath(fromCell, toCell);
      if (path.length === 0) {
        this.cell = this.oldCell;
        const [x, y] = this._buildCoordinates(this.cell);
        this.clear({x, y});
        this.draw(x, y, this.sprites.main);
      } else {
        for (const nextCell of path) {
          if (!this.enter(nextCell)) {
            if (this.canInteractWith(nextCell.slot, 'melee')) {
              this.interactWith(nextCell.slot, 'melee');
              if (!this.enter(nextCell)) {
                this.cell = fromCell;
                this.clear(...this._buildCoordinates(this.cell));
                this.draw(...this._buildCoordinates(this.cell), this.sprites.main);
                break;
              }
            } else {
              this.cell = fromCell;
              this.clear(...this._buildCoordinates(this.cell));
              this.draw(...this._buildCoordinates(this.cell), this.sprites.main);
              break;
            }
          }
          this.leave(fromCell);
          yield* this.animate(fromCell, nextCell, 4);
          fromCell = nextCell;
        }
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

  render() {
    if (!this.needRender) {
      this.clear(...this._buildCoordinates(this.cell));
      this.draw(...this._buildCoordinates(this.cell), this.sprites.main);
      return;
    }
    if (this.moveGenerator == null)
      this.moveGenerator = this.moveGeneratorFactory();
    const {done} = this.moveGenerator.next();
    if (done) this.moveGenerator = null;
  }

  clear({x, y} = {}) {
    // if (x == null || y == null) return;
    // this.ctx.globalCompositeOperation = 'destination-out';
    // this.draw(x-2, y-2, this.sprites.clear || this.sprites.main);
    // this.ctx.globalCompositeOperation = 'source-over';
  }
}
