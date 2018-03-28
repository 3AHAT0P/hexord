export default class HexCell {
  constructor(rowId, columnId, position, options, parent) {
    this.rowId = rowId
    this.columnId = columnId
    this.position = position
    this.height = options.height
    this.width = options.width
    this.background = options.clearColor
    this.borderSize = options.border
    this.borderColor = options.borderColor
    this.hoverColor = options.hoverColor
    this.edgeLength = options.edgeLength
    this.parent = parent
    this.isHovered = false

    this.needRender = true

    this.isEmpty = true

    this.layers = []

    this.addLayer('background', this.renderBackground, this, [], false)
    this.addLayer('border', this.renderBorder, this, [], false)
    this.addLayer('id', this.renderId, this, [], false)
  }

  removeLayer(layerName, needRender=true) {
    this.layers.splice(this.layers.findIndex((item)=> item.name === layerName), 1)
    if (needRender)
      this.needRender = true
  }

  addLayer(layerName, delegate, context, args, needRender=true) {
    this.layers.push({
      name: layerName,
      delegate: delegate,
      context: context,
      args: args
    })
    if (needRender)
      this.needRender = true
  }

  hover(flag = true) {
    this.isHovered = flag
    if (flag)
      this.addLayer('hover', this.renderHover, this)
    else
      this.removeLayer('hover')
  }

  async render(ctx) {
    if (!this.needRender) return
    this.clear(ctx)
    for (let layer of this.layers) {
      layer.delegate.apply(layer.context, [ctx, this.position.x, this.position.y].concat(layer.args))
    }
    this.needRender = false
  }

  buildCtx(width, height) {
    // let canvas = new OffscreenCanvas(this.width,this.height)
    let canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    return canvas.getContext('2d')
  }

  async buildBitmap(ctx) {
    // return canvas.transferToImageBitmap()
    return await createImageBitmap(ctx.canvas)
  }

  get sprite() {
    let ctx = this.buildCtx(this.width, this.height)
    for (let layer of this.layers) layer.delegate.call(layer.context, ctx)
    return this.buildBitmap(ctx)
  }

  clear(ctx) {
    ctx.globalCompositeOperation = 'destination-out'
    this.fill(ctx, {x: this.position.x + this.width/2, y: this.position.y}, this.width, {
      color: this.background,
      borderSize: this.borderSize
    })
    ctx.globalCompositeOperation = 'source-over'
  }

  renderBackground (ctx, x=0, y=0) {
    return ctx
  }
  renderBorder (ctx, x=0, y=0) {
    this.fill(ctx, {x: x+this.width/2, y: y}, this.width, {
      color: this.borderColor,
      borderSize: this.borderSize
    })
    this.fill(ctx, {x: x+this.width/2, y: y+this.borderSize}, this.width - this.borderSize*2, {
      color: this.background,
      borderSize: this.borderSize,
      clear: true
    })
    return ctx
  }
  renderId (ctx, x=0, y=0) {
    let _fillStyle = ctx.fillStyle
    ctx.fillStyle = "hsla(0, 0%, 0%, .6)";
    let text = ctx.measureText(`${this.rowId}:${this.columnId}`)
    ctx.fillText(`${this.rowId}:${this.columnId}`, x + this.width/2 - text.width/2, y + this.height/2 + this.borderSize)
    ctx.fillStyle = _fillStyle
    return ctx
  }
  renderHover (ctx, x=0, y=0) {
    this.fill(ctx, {x: x+this.width/2, y: y+this.borderSize}, this.width - this.borderSize*2, {
      color: this.hoverColor,
      borderSize: this.borderSize
    })
    return ctx
  }

  renderObjectIn(imageData, positionX, positionY) {
    let delegate = function (ctx, x=0, y=0, imageData, positionX, positionY) {
      let relativeX = 0
      let relativeY = 0
      switch (positionX) {
        case 'center':
          relativeX = this.width/2 - imageData.width/2
          break;
        default:
          relativeX = 0
      }
      switch (positionY) {
        case 'center':
          relativeY = this.height/2 - imageData.height/2 - this.borderSize
          break;
        default:
          relativeY = 0
      }
      ctx.drawImage(imageData, x + relativeX, y + relativeY)
      return ctx
    }
    this.layers.push({
      name: 'hover',
      delegate: delegate,
      context: this,
      args: [imageData, positionX, positionY]
    })
    this.render()
  }

  fill(ctx, {x, y}, width, options = {}) {
    let _fillStyle = ctx.fillStyle
    ctx.fillStyle = options.color || "red";
    y += options.borderSize || 0
    if (options.clear)
      ctx.globalCompositeOperation = 'destination-out'
    let lineLength = Math.sqrt(width*width/3)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x+width/2, y+lineLength/2)
    ctx.lineTo(x+width/2, y+lineLength/2+lineLength)
    ctx.lineTo(x, y+lineLength/2+lineLength+lineLength/2)
    ctx.lineTo(x-width/2, y+lineLength/2+lineLength)
    ctx.lineTo(x-width/2, y+lineLength/2)
    ctx.lineTo(x, y)
    ctx.fill()
    ctx.closePath()
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = _fillStyle
  }
  getPositionX(localPosition) {
    let x = this.position.x //+ this.borderSize
    switch (localPosition) {
      case 'center':
        return x + this.width/2
      default:
        return x
    }
  }
  getPositionY(localPosition) {
    let y = this.position.y //+ this.borderSize
    switch (localPosition) {
      case 'center':
        return y + this.height/2
      default:
        return y
    }
  }
}
