import { AbstractLayer } from './';

export default class DynamicObjectsLayer extends AbstractLayer {
  constructor(scene, width, height) {
    super(scene, width, height);
    this.objects = [];
  }
  connectObject(obj) {
    this.objects.push(obj);
  }
  disconnectObject(obj) {
    this.objects.splice(this.objects.indexOf(obj));
  }
  render() {
    this.clear();
    for (const obj of this.objects) {
      // if (obj.needRender) obj.render(this.ctx);
      obj.render(this.ctx);
    }
  }
  clear() {
    const _fillStyle = this.fillStyle;
    this.ctx.globalCompositeOperation = 'destination-out';
    this.fillStyle = 'hsla(0, 0%, 0%, 1)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = 'source-over';
    this.fillStyle = _fillStyle;
  }
}
