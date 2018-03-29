import { bind } from '../../lib/decorators';

import { RenderedObject } from '../'

export default class Player extends RenderedObject {
  moveGenerator = null;

  @bind
  _init() {
    this.scene.on('cellClicked', this.move);
  }

  constructor(scene, {x, y}, sprites, cell) {
    super(scene, {x, y}, sprites, cell)
  }

  @bind
  move(newCell) {
    if (this.__moveLock) return;
    this.oldCell = this.cell;
    this.cell = newCell;
    this.needRender = true;
  }

  *moveGeneratorFactory(ctx) {
    this.__moveLock = true;
    let fromCell = this.oldCell;
    let toCell = this.cell;
    if (fromCell == null) fromCell = toCell;
    const path = this.scene.findPath(fromCell, toCell);
    if (path.length === 0) this.cell = this.oldCell;
    for (const nextCell of path) {
      // fromCell.isEmpty = true
      // nextCell.isEmpty = false
      const posX = nextCell.getPositionX('center') - this.width / 2;
      const posY = nextCell.getPositionY('center') - this.height / 2;
      let nextX = fromCell.getPositionX('center') - this.width / 2;
      let nextY = fromCell.getPositionY('center') - this.height / 2;
      const stepCount = 10;
      const dX = (posX - nextX) / stepCount;
      const dY = (posY - nextY) / stepCount;
      if (dX !== 0 || dY !== 0) {
        for (let i = 0; i < stepCount - 1; ++i) {
          this.clear(ctx, {x: nextX, y: nextY});
          nextX += dX;
          nextY += dY;
          this.draw(ctx, nextX, nextY, this.sprites[0]);
          yield;
        }
      }

      this.clear(ctx, {x: nextX, y: nextY});
      this.draw(ctx, posX, posY, this.sprites[0]);
      yield;
      fromCell = nextCell;
    }
    this.needRender = false;
    this.__moveLock = false;
    yield;
  }
  render(ctx) {
    if (this.moveGenerator == null)
      this.moveGenerator = this.moveGeneratorFactory(ctx);
    const {value, done} = this.moveGenerator.next();
    if (done) this.moveGenerator = null;
  }
  clear(ctx, {x, y} = {}) {
    if (x == null || y == null) return;
    ctx.globalCompositeOperation = 'destination-out';
    this.draw(ctx, x, y, this.sprites[0]);
    ctx.globalCompositeOperation = 'source-over';
  }
}
