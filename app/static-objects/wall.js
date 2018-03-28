import { RenderedObject } from '../'

export default class Wall extends RenderedObject {
  constructor(scene, width, height, sprite, currentCell, gridLayer) {
    super(scene, width, height, sprite, currentCell, gridLayer)
    this.currentCell.isEmpty = false
  }
  render(ctx) {
    let x = this.currentCell.getPositionX('center') - this.width/2
    let y = this.currentCell.getPositionY('center') - this.height/2
    this.draw(ctx, x, y, this.width, this.height, {color: 'red'})
    this.needRender = false
  }
}
