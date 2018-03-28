import { AbstractLayer } from './'

import { inject } from '../../lib/utils'

export default class InputLayer extends AbstractLayer {
  constructor(scene, width, height) {
    super(scene, width, height)
  }

  init() {
    super.init();
    this.element.addEventListener('mousemove', this.onMouseMove.bind(this), {passive: true});
    this.element.addEventListener('mousedown', this.onMouseDown.bind(this), {passive: true});
  }

  onMouseMove(e) {
    this.scene.emit('mousemove', e);
  }

  onMouseDown(e) {
    this.scene.emit('mousedown', e);
  }
}
