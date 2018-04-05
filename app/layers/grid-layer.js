import { MappedPriorityQueue } from '../../lib';
import { bind } from '../../lib/decorators';

import { AbstractLayer } from './';
import { HexCell } from '../cells';

class Point {
  rowId = null;
  columnId = null;
  prev = null;
  cost = 1;
  g = 0;
  h = null;
  f = null;

  get id() {
    return `${this.rowId}:${this.columnId}`;
  }

  constructor(rowId, columnId, prev = null, getCell) {
    this.rowId = rowId;
    this.columnId = columnId;
    this.prev = prev;
    if (prev != null) this.calculateDistance(prev);
    this.cell = getCell(rowId, columnId);
  }

  isEqualTo(point) {
    return this.rowId === point.rowId && this.columnId === point.columnId;
  }

  buildPath(path = []) {
    if (this.prev == null) return path;
    this.prev.buildPath(path);
    path.push(this.cell);
    return path;
  }

  calculateDistance(point) {
    this.g = point.g + this.cost;
  }

  updateEstimation() {
    this.f = this.g + this.h;
  }

  estimateHeuristicDistanceTo(cell) {
    // ????

    // very bad
    // this.h = Math.abs(this.rowId - cell.rowId) + Math.abs(this.columnId - cell.columnId)

    // bad
    // let currentCell = this.getCell(this.rowId, this.columnId)
    // let toCell = this.getCell(cell.rowId, cell.columnId)
    // if (currentCell == null || toCell == null) debugger
    // let currentX = this.getCell(this.rowId, this.columnId).getPositionX('center')
    // let currentY = this.getCell(this.rowId, this.columnId).getPositionY('center')
    // let toX = this.getCell(cell.rowId, cell.columnId).getPositionX('center')
    // let toY = this.getCell(cell.rowId, cell.columnId).getPositionY('center')
    // this.h = Math.abs(currentX - toX) +  Math.abs(currentY - toY)


    // not tested
    // let fromCell = this.getCell(this.rowId, this.columnId)
    // let toCell = this.getCell(cell.rowId, cell.columnId)
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
    // this.h = res

    // WTF How it's work???
    this.h = 1;
    this.updateEstimation();
  }
}

export default class GridLayer extends AbstractLayer {
  constructor(scene, width, height, cellOptions) {
    super(scene, width, height);
    this.cellOptions = cellOptions;
    this.cellOptions.edgeLength = Math.sqrt(this.cellOptions.width*this.cellOptions.width/3);
    this.cellOptions.height = this.cellOptions.edgeLength*2 + 2*this.cellOptions.border;

    this.hoveredCell = null;
    this.activeCell = null;
    this.rowHeight = this.cellOptions.edgeLength*3/2;
    this.oddRowOffset = -this.cellOptions.width/2;
    this.rowCount = Math.trunc(height/this.rowHeight) - 4;
    this.columnCount = Math.trunc(width/this.cellOptions.width) - 1;
    this.cells = [];
    this.generateCells();
    this.firstRender = true;
    this.scene.on('mousemove', this.onMouseMove);
    this.scene.on('mousedown', this.onMouseDown);
  }

  generateCells() {
    for (let rowId = 0; rowId < this.rowCount; ++rowId) {
      for (let columnId = 0; columnId < this.columnCount; ++columnId) {
        let y = (rowId + 2) * this.rowHeight;
        let x = (columnId + 1) * this.cellOptions.width + ((rowId + 2) % 2) * this.oddRowOffset;
        this.cells.push(this.cells[`${rowId}:${columnId}`] = new HexCell(rowId, columnId, {x, y}, this.cellOptions, this));
      }
    }
  }

  @bind
  onMouseMove(e) {
    let currentCell = this.getCellFromPoint(e.layerX, e.layerY);
    if (currentCell != null) e.target.style.cursor = 'pointer';
    else e.target.style.cursor = 'default';
    if (this.hoveredCell === currentCell) return;
    if (currentCell != null) currentCell.hover();

    if (this.hoveredCell != null) this.hoveredCell.hover(false);
    this.hoveredCell = currentCell;
  }

  @bind
  onMouseDown(e) {
    let cell = this.getCellFromPoint(e.layerX, e.layerY);
    if (cell == null) return;
    this.scene.emit('cellClicked', cell);
  }

  getCellFromPoint(x, y) {
    let index = Math.trunc(x*2/this.cellOptions.width) + 1;
    let rowId = Math.trunc(y/this.rowHeight);
    let dy = rowId * this.rowHeight;
    let fx = 0;
    // f(x) = y = ax + b; b = dy + c
    let a = this.cellOptions.edgeLength / this.cellOptions.width;
    let sign  = Math.pow(-1, index); // (1 - 2*(index%2))
    if (rowId % 2 === 0) {
      sign  = -sign; // (-1 + 2*(index%2))
      let c = Math.ceil(index/2 - 1) * this.cellOptions.edgeLength + this.cellOptions.edgeLength/2;
      fx = dy + (c - a * x) * sign;
    } else {
      let c = Math.floor(index/2) * this.cellOptions.edgeLength;
      fx = dy + (c - a * x) * sign;
    }

    if (y < fx) --rowId;

    let columnId = -1;
    if (rowId % 2 === 1)
      columnId = Math.trunc((x - this.oddRowOffset)/this.cellOptions.width);
    else
      columnId = Math.trunc(x/this.cellOptions.width);
    return this.getCell(rowId - 2, columnId - 1);
  }

  @bind
  getCell(rowId, columnId) {
    return this.cells[`${rowId}:${columnId}`];
  }

  render() {
    for (let cell of this.cells) {
      if (cell.needRender) {
        cell.render(this.ctx);
      }
    }
  }

  getNearblyCells(cell, type = 'all') {
    return this.getNeighbor(cell).reduce(
      (result, [neighborRowId, neighborColumnId]) => {
        const cell = this.getCell(neighborRowId, neighborColumnId);
        if (type === 'all') result.push(cell);
        else if (type === 'empty' && cell.isEmpty) result.push(cell);
        else if (type === 'notempty' && !cell.isEmpty) result.push(cell);
        return result;
      },
      []
    );
  }

  getNeighbor(point) {
    let res = [];
    let prevRowId = point.rowId - 1;
    let nextRowId = point.rowId + 1;
    let prevColumnId = point.columnId - point.rowId%2;
    let nextColumnId = point.columnId + Number(point.rowId%2 === 0);
    if (prevRowId >= 0) {
      if (prevColumnId >= 0)
        res.push([prevRowId, prevColumnId]);
      if (nextColumnId < this.columnCount)
        res.push([prevRowId, nextColumnId]);
    }
    if (point.columnId + 1 < this.columnCount)
      res.push([point.rowId,     point.columnId + 1]);
    if (nextRowId < this.rowCount) {
      if (nextColumnId < this.columnCount)
        res.push([nextRowId, nextColumnId]);
      if (prevColumnId >= 0)
        res.push([nextRowId, prevColumnId]);
    }
    if (point.columnId - 1 >= 0)
      res.push([point.rowId,     point.columnId - 1]);
    return res;
  }

  getPath(fromCell, toCell) {
    const openedPathPoints = new MappedPriorityQueue();
    const closedPathPoints = new MappedPriorityQueue();

    let pathPoint = new Point(fromCell.rowId, fromCell.columnId, null, this.getCell);
    pathPoint.estimateHeuristicDistanceTo(toCell);
    openedPathPoints.add(pathPoint.f, pathPoint);

    while ((pathPoint = openedPathPoints.getMin()) != null) {
      if (pathPoint.isEqualTo(toCell)) return pathPoint.buildPath();

      for (const [neighborRowId, neighborColumnId] of this.getNeighbor(pathPoint)) {
        if (!this.getCell(neighborRowId, neighborColumnId).isEmpty) {
          if (neighborRowId === toCell.rowId && neighborColumnId === toCell.columnId) {
            const endPoint = new Point(neighborRowId, neighborColumnId, pathPoint, this.getCell);
            return endPoint.buildPath();
          }
          continue;
        }
        const neighborId = `${neighborRowId}:${neighborColumnId}`;
        let neighborPoint = openedPathPoints.getById(neighborId) || closedPathPoints.getById(neighborId);
        if (neighborPoint == null) {
          neighborPoint = new Point(neighborRowId, neighborColumnId, pathPoint, this.getCell);
          neighborPoint.estimateHeuristicDistanceTo(toCell);
        } else {
          if (neighborPoint.g <= pathPoint.g + pathPoint.cost) continue;
          neighborPoint.calculateDistance(pathPoint);
          neighborPoint.updateEstimation();
        }

        if (closedPathPoints.has(neighborId)) closedPathPoints.removeById(neighborId);
        if (!openedPathPoints.has(neighborId)) openedPathPoints.add(neighborPoint.f, neighborPoint);
      }
      closedPathPoints.add(pathPoint.f, pathPoint);
    }
    return [];
  }
}
