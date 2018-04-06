import { MappedPriorityQueue } from '../../lib';
import { bind } from '../../lib/decorators';

import { AbstractLayer } from './';
import { HexCell } from '../cells';
import { HexPoint } from '../points';

export default class GridLayer extends AbstractLayer {
  hoveredCell = null;
  activeCell = null;
  firstRender = true;
  cells = [];

  constructor(scene, width, height, cellOptions) {
    super(scene, width, height);
    this.cellOptions = cellOptions;
    this.cellOptions.edgeLength = Math.sqrt(this.cellOptions.width*this.cellOptions.width/3);
    this.cellOptions.height = this.cellOptions.edgeLength*2 + 2*this.cellOptions.border;

    this.rowHeight = this.cellOptions.edgeLength*3/2;
    this.oddRowOffset = -this.cellOptions.width/2;
    this.rowCount = Math.trunc(height/this.rowHeight) - 4;
    this.columnCount = Math.trunc(width/this.cellOptions.width) - 1;
    this.generateCells();
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
    const cells = this.getNeighbor(cell);
    if (type === 'all') return cells;
    if (type === 'empty') return cells.filter((cell) => cell.isEmpty);
    if (type === 'notempty') return cells.filter((cell) => !cell.isEmpty);
  }

  getNeighbor(cell) {
    const res = [];
    const prevRowId = cell.rowId - 1;
    const nextRowId = cell.rowId + 1;
    const prevColumnId = cell.columnId - cell.rowId%2;
    const nextColumnId = cell.columnId + Number(cell.rowId%2 === 0);
    if (prevRowId >= 0) {
      if (prevColumnId >= 0) res.push(this.getCell(prevRowId, prevColumnId));
      if (nextColumnId < this.columnCount) res.push(this.getCell(prevRowId, nextColumnId));
    }
    if (cell.columnId + 1 < this.columnCount) res.push(this.getCell(cell.rowId, cell.columnId + 1));
    if (nextRowId < this.rowCount) {
      if (nextColumnId < this.columnCount) res.push(this.getCell(nextRowId, nextColumnId));
      if (prevColumnId >= 0) res.push(this.getCell(nextRowId, prevColumnId));
    }
    if (cell.columnId - 1 >= 0) res.push(this.getCell(cell.rowId, cell.columnId - 1));
    return res;
  }

  getPath(fromCell, toCell) {
    const openedPathPoints = new MappedPriorityQueue();
    const closedPathPoints = new MappedPriorityQueue();

    let pathPoint = fromCell.buildPathPoint();
    pathPoint.estimateHeuristicDistanceTo(toCell);
    openedPathPoints.add(pathPoint.f, pathPoint);

    while ((pathPoint = openedPathPoints.getMin()) != null) {
      if (pathPoint.cell.isEqualTo(toCell)) return pathPoint.buildPath();

      for (const neighborCell of this.getNeighbor(pathPoint.cell)) {
        if (!neighborCell.isEmpty) {
          if (neighborCell.isEqualTo(toCell))
            return neighborCell.buildPathPoint(pathPoint).buildPath();
          continue;
        }

        let neighborPoint = openedPathPoints.getById(neighborCell.id) || closedPathPoints.getById(neighborCell.id);
        if (neighborPoint == null) {
          neighborPoint = neighborCell.buildPathPoint(pathPoint);
          neighborPoint.estimateHeuristicDistanceTo(toCell);
        } else {
          if (neighborPoint.g <= pathPoint.g + pathPoint.cost) continue;
          neighborPoint.calculateDistance(pathPoint);
          neighborPoint.updateEstimation();
        }

        if (closedPathPoints.has(neighborPoint.id)) closedPathPoints.removeById(neighborPoint.id);
        if (!openedPathPoints.has(neighborPoint.id)) openedPathPoints.add(neighborPoint.f, neighborPoint);
      }
      closedPathPoints.add(pathPoint.f, pathPoint);
    }
    return [];
  }
}
