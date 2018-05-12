export default class HexPathPoint {
  cell = null;
  cost = 1;
  prev = null;
  g = 0;
  h = null;
  f = null;

  get id() {
    return this.cell.id;
  }

  constructor(cell, cost = 1, prev = null) {
    this.cell = cell;
    this.cost = cost;
    this.prev = prev;
    if (prev != null) this.calculateDistance(prev);
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
    // WTF How it's work???
    // this.h = 1;

    const a = this.cell.cubeCoords;
    const b = cell.cubeCoords;
    this.h = Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));
    this.updateEstimation();
  }
}
