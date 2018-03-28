import { RenderedObject } from '../'

export default class Player extends RenderedObject {
  constructor(scene, width, height, sprite, currentCell, gridLayer) {
    super(scene, width, height, sprite, currentCell, gridLayer)
    this.moveGenerator = null
  }

  init() {
    this.scene.on('cellClicked', this.move.bind(this))
  }

  move(newCell) {
    if (this.__moveLock) return
    this.oldCell = this.currentCell
    this.currentCell = newCell
    this.needRender = true;
  }
  *moveGeneratorFactory(ctx) {
    this.__moveLock = true
    let fromCell = this.oldCell
    let toCell = this.currentCell
    if (fromCell == null) fromCell = toCell
    let path = this.scene.findPath(fromCell, toCell)
    if (path.length === 0) this.currentCell = this.oldCell
    for (let nextCell of path) {
      // fromCell.isEmpty = true
      // nextCell.isEmpty = false
      let posX = nextCell.getPositionX('center') - this.width/2
      let posY = nextCell.getPositionY('center') - this.height/2
      let nextX = fromCell.getPositionX('center') - this.width/2
      let nextY = fromCell.getPositionY('center') - this.height/2
      let stepCount = 10
      let dX = (posX - nextX) / stepCount
      let dY = (posY - nextY) / stepCount
      if (dX !== 0 || dY !== 0) {
        for (let i = 0; i < stepCount - 1; ++i) {
          this.clear(ctx, {x: nextX, y: nextY})
          nextX += dX
          nextY += dY
          this.draw(ctx, nextX, nextY, this.width, this.height, {color: 'green'})
          yield
        }
      }

      this.clear(ctx, {x: nextX, y: nextY})
      this.draw(ctx, posX, posY, this.width, this.height, {color: 'green'})
      yield
      fromCell = nextCell
    }
    this.needRender = false
    this.__moveLock = false
    yield
  }
  render(ctx) {
    if (this.moveGenerator != null) {
      const {value, done} = this.moveGenerator.next()
      if (done) {
        this.moveGenerator = null
      }
    } else {
      this.moveGenerator = this.moveGeneratorFactory(ctx)
      const {value, done} = this.moveGenerator.next()
      if (done) {
        this.moveGenerator = null
      }
    }
  }
  clear(ctx, {x, y} = {}) {
    if (x == null || y == null) return
    ctx.globalCompositeOperation = 'destination-out'
    this.draw(ctx,
      x - 2,
      y - 2,
      this.width + 4,
      this.height + 4,
      {color: 'green'}
    )
    ctx.globalCompositeOperation = 'source-over'
  }
}
