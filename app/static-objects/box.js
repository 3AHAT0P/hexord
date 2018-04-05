import { RenderedObject } from '../';

export default class Box extends RenderedObject {
  canInteract = new Map(Object.entries({
    take: 'melee'
  }));

  constructor(scene, {x, y}, sprites, cell) {
    super(scene, {x, y}, sprites, cell);
    this.cell.enter(this);
  }

  interact(actionName, actionType) {
    if (actionName === 'take') {
      this.drop();
    }
  }

  drop() {
    this.scene.dropBox();
    this.cell.leave(this);
    this.clear();
    this.needClear = true;
    this.needRender = true;
  }
}
