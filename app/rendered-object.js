export default class RenderedObject {
  constructor(scene, width, height, sprite, currentCell, gridLayer) {
    this.scene = scene;
    this.width = width
    this.height = height
    this.sprite = sprite
    this.currentCell = currentCell
    this.gridLayer = gridLayer

    this.needRender = true
    setTimeout(this.init.bind(this));
  }

  init() {
    
  }

  render(ctx) {
    let x = this.currentCell.getPositionX('center') - this.width/2
    let y = this.currentCell.getPositionY('center') - this.height/2
    this.draw(ctx, x, y, this.width, this.height, {color: 'green'})
    this.needRender = false
  }
  draw(ctx, x, y, width, height, options = {}) {
    let _fillStyle = ctx.fillStyle
    ctx.fillStyle = options.color || "red";
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x+width, y)
    ctx.lineTo(x+width, y+height)
    ctx.lineTo(x, y+height)
    ctx.lineTo(x, y)
    ctx.fill()
    ctx.closePath()
    ctx.fillStyle = _fillStyle
  }
}
