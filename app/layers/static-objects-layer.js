import { AbstractLayer } from './';

export default class StaticObjectsLayer extends AbstractLayer {
  constructor(scene, width, height) {
    super(scene, width, height);
    this.objects = [];
  }

  connectObject(obj) {
    this.objects.push(obj);
  }

  render() {
    for (const obj of this.objects) {
      if (obj.needRender) {
        obj.render(this.ctx);
      }
    }
  }
}
