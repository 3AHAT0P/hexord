import { AbstractLayer } from './'
import { HexCell } from '../cells'
import { MappedPriorityQueue } from '../../lib'

export default class GridLayer extends AbstractLayer {
  constructor(scene, width, height, cellOptions) {
    super(scene, width, height)
    this.cellOptions = cellOptions
    this.cellOptions.edgeLength = Math.sqrt(this.cellOptions.width*this.cellOptions.width/3)
    this.cellOptions.height = this.cellOptions.edgeLength*2 + 2*this.cellOptions.border

    this.hoveredCell = null
    this.activeCell = null
    this.rowHeight = this.cellOptions.edgeLength*3/2
    this.oddRowOffset = -this.cellOptions.width/2
    this.rowCount = Math.trunc(height/this.rowHeight) + 2
    this.columnCount = Math.trunc(width/this.cellOptions.width) + 2
    this.cells = []
    this.generateCells()
    this.firstRender = true
    this.scene.on('mousemove', this.onMouseMove.bind(this))
    this.scene.on('mousedown', this.onMouseDown.bind(this))
  }

  generateCells() {
    for (let rowId = 0; rowId < this.rowCount; ++rowId) {
      for (let columnId = 0; columnId < this.columnCount; ++columnId) {
        let y = rowId * this.rowHeight
        let x = columnId * this.cellOptions.width + (rowId % 2) * this.oddRowOffset
        this.cells.push(this.cells[`${rowId}:${columnId}`] = new HexCell(rowId, columnId, {x, y}, this.cellOptions, this))
      }
    }
  }

  onMouseMove(e) {
    let currentCell = this.getCellFromPoint(e.layerX, e.layerY)
    if (this.hoveredCell === currentCell) return
    if (currentCell != null) currentCell.hover()

    if (this.hoveredCell != null) this.hoveredCell.hover(false)
    this.hoveredCell = currentCell
  }

  onMouseDown(e) {
    let cell = this.getCellFromPoint(e.layerX, e.layerY)
    this.scene.emit('cellClicked', cell)
  }

  getCellFromPoint(x, y) {
    let index = Math.trunc(x*2/this.cellOptions.width) + 1
    let rowId = Math.trunc(y/this.rowHeight)
    let dy = rowId * this.rowHeight
    let fx = 0
    // f(x) = y = ax + b; b = dy + c
    let a = this.cellOptions.edgeLength / this.cellOptions.width
    let sign  = Math.pow(-1, index) //(1 - 2*(index%2))
    if (rowId % 2 === 0) {
      sign  = -sign //(-1 + 2*(index%2))
      let c = Math.ceil(index/2 - 1) * this.cellOptions.edgeLength + this.cellOptions.edgeLength/2
      fx = dy + (c - a * x) * sign
    } else {
      let c = Math.floor(index/2) * this.cellOptions.edgeLength
      fx = dy + (c - a * x) * sign
    }

    if (y < fx) --rowId

    let columnId = -1
    if (rowId % 2 === 1)
      columnId = Math.trunc((x - this.oddRowOffset)/this.cellOptions.width)
    else
      columnId = Math.trunc(x/this.cellOptions.width)
    return this.getCell(rowId, columnId)
  }
  getCell(rowId, columnId) {
    return this.cells[`${rowId}:${columnId}`]
  }
  render() {
    for (let cell of this.cells) {
      if (cell.needRender) {
        cell.render(this.ctx)
      }
    }
  }

  getNeighbor(point) {
    let res = []
    let prevRowId = point.rowId - 1
    let nextRowId = point.rowId + 1
    let prevColumnId = point.columnId - point.rowId%2
    let nextColumnId = point.columnId + Number(point.rowId%2 === 0)
    if (prevRowId >= 0) {
      if (prevColumnId >= 0)
        res.push([prevRowId, prevColumnId])
      if (nextColumnId < this.columnCount)
        res.push([prevRowId, nextColumnId])
    }
    if (point.columnId + 1 < this.columnCount)
      res.push([point.rowId,     point.columnId + 1])
    if (nextRowId < this.rowCount) {
      if (nextColumnId < this.columnCount)
        res.push([nextRowId, nextColumnId])
      if (prevColumnId >= 0)
        res.push([nextRowId, prevColumnId])
    }
    if (point.columnId - 1 >= 0)
      res.push([point.rowId,     point.columnId - 1])
    return res
  }

  heuristicEstimate(currentPoint, toPoint) {
    // ????

    // very bad
    // return Math.abs(currentPoint.rowId - toPoint.rowId) + Math.abs(currentPoint.columnId - toPoint.columnId)

    // bad
    // let currentCell = this.getCell(currentPoint.rowId, currentPoint.columnId)
    // let toCell = this.getCell(toPoint.rowId, toPoint.columnId)
    // if (currentCell == null || toCell == null) debugger
    // let currentX = this.getCell(currentPoint.rowId, currentPoint.columnId).getPositionX('center')
    // let currentY = this.getCell(currentPoint.rowId, currentPoint.columnId).getPositionY('center')
    // let toX = this.getCell(toPoint.rowId, toPoint.columnId).getPositionX('center')
    // let toY = this.getCell(toPoint.rowId, toPoint.columnId).getPositionY('center')
    // return  Math.abs(currentX - toX) +  Math.abs(currentY - toY)


    // not tested
    // let fromCell = this.getCell(currentPoint.rowId, currentPoint.columnId)
    // let toCell = this.getCell(toPoint.rowId, toPoint.columnId)
    // let res = 0
    // let finishPointX = toCell.getPositionX('center')
    // let finishPointY = toCell.getPositionY('center')
    // while (fromCell !== toCell) {
    //   let x = finishPointX - fromCell.getPositionX('center')
    //   let y = finishPointY - fromCell.getPositionY('center')
    //   if (x >= 0 && y >= 0) {
    //     if (y <= x/Math.sqrt(3)) {
    //       --pathX
    //       ++res
    //     } else if (y > x/Math.sqrt(3)) {
    //       if ((finishY - pathY)%2 === 0) --pathX
    //       --pathY
    //       ++res
    //     }
    //   } else if (x <= 0 && y >= 0) {
    //     if (y >= -x/Math.sqrt(3)) {
    //       if ((finishY - pathY)%2 === 1) ++pathX
    //       --pathY
    //       ++res
    //     } else if (y < -x/Math.sqrt(3)) {
    //       ++pathX
    //       ++res
    //     }
    //   } else if (x <= 0 && y <= 0) {
    //     if (-y <= -x/Math.sqrt(3)) {
    //       ++pathX
    //       ++res
    //     } else if (-y > -x/Math.sqrt(3)) {
    //       if ((finishY - pathY)%2 === 1) ++pathX
    //       ++pathY
    //       ++res
    //     }
    //   } else if (x >= 0 && y <= 0) {
    //     if (-y >= x/Math.sqrt(3)) {
    //       if ((finishY - pathY)%2 === 0) --pathX
    //       ++pathY
    //       ++res
    //     } else if (-y < x/Math.sqrt(3)) {
    //       --pathX
    //       ++res
    //     }
    //   }
    // }
    // return res

    // WTF How it's work???
    return 1
  }

  buildPathPoint(rowId, columnId, prev) {
    let pathPoint = {
      id: `${rowId}:${columnId}`,
      rowId: rowId,
      columnId: columnId,
      prev: prev,
      g: prev ? prev.g + 1 : 0,
      h: null,
      f: null
    }
    return pathPoint
  }

  buildPath(point) {
    let res = [this.getCell(point.rowId, point.columnId)]

    while ((point = point.prev) != null)
      res.unshift(this.getCell(point.rowId, point.columnId))

    return res
  }

  getPath(fromCell, toCell) {
    let openedPathPoints = new MappedPriorityQueue()
    let closedPathPoints = new MappedPriorityQueue()
    let pathPoint = this.buildPathPoint(fromCell.rowId, fromCell.columnId, null)
    pathPoint.h = this.heuristicEstimate(pathPoint, toCell)
    pathPoint.f = pathPoint.g + pathPoint.h
    openedPathPoints.add(pathPoint.f, pathPoint)
    while ((pathPoint = openedPathPoints.getMin()) != null) {
      if (pathPoint.rowId === toCell.rowId && pathPoint.columnId === toCell.columnId) {
        return this.buildPath(pathPoint)
      }
      for (const [neighborRowId, neighborColumnId] of this.getNeighbor(pathPoint)) {
        if (!this.getCell(neighborRowId, neighborColumnId).isEmpty) continue
        let neighborId = `${neighborRowId}:${neighborColumnId}`
        let neighborPoint = openedPathPoints.getById(neighborId) || closedPathPoints.getById(neighborId)
        if (neighborPoint == null) {
          neighborPoint = this.buildPathPoint(neighborRowId, neighborColumnId, pathPoint)
          neighborPoint.h = this.heuristicEstimate(neighborPoint, toCell)
        } else {
          if (neighborPoint.g <= pathPoint.g + 1) continue
          else neighborPoint.g = pathPoint.g + 1
        }
        // if (!this.getCell(neighborRowId, neighborColumnId).isEmpty)
        //   neighborPoint.g = Infinity

        neighborPoint.f = neighborPoint.g + neighborPoint.h
        if (closedPathPoints.has(neighborId)) closedPathPoints.removeById(neighborId)
        if (!openedPathPoints.has(neighborId)) openedPathPoints.add(neighborPoint.f, neighborPoint)
      }
      closedPathPoints.add(pathPoint.f, pathPoint)
    }
    return []
  }
}
