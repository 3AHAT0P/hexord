export default class HexPoint {
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

  get cubeCoords() {
    const x = this.columnId - (this.rowId + (this.rowId & 1)) / 2;
    const z = this.rowId;
    const y = -1 * (x + z);
    return {x, y, z};
  }

  estimateHeuristicDistanceTo(cell) {
    // WTF How it's work???
    // this.h = 1;

    const a = this.cubeCoords;
    const b = cell.cubeCoords;
    this.h = Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));
    this.updateEstimation();
  }
}
