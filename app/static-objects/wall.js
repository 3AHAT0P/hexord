import { RenderedObject } from '../';

export default class Wall extends RenderedObject {
  constructor(scene, {x, y}, sprites, cell) {
    super(scene, {x, y}, sprites, cell);
    this.cell.enter(this);
  }
}
