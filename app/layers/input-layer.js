import { bind } from '../../lib/decorators';

import { AbstractLayer } from './';

export default class InputLayer extends AbstractLayer {
  constructor(scene, width, height) {
    super(scene, width, height);
  }

  init() {
    super.init();
    this.element.addEventListener('mousemove', this.onMouseMove, {passive: true});
    this.element.addEventListener('mousedown', this.onMouseDown, {passive: true});
  }

  @bind
  onMouseMove(e) {
    this.scene.emit('mousemove', e);
  }

  @bind
  onMouseDown(e) {
    this.scene.emit('mousedown', e);
  }
}
