import { AbstractLayer } from './'

export default class DynamicObjectsLayer extends AbstractLayer {
  constructor(scene, width, height) {
    super(scene, width, height)
    this.objects = []
  }
  connectObject(obj) {
    this.objects.push(obj)
  }
  disconnectObject(obj) {
    this.objects.splice(this.objects.indexOf(obj))
  }
  render() {
    for (const obj of this.objects) {
      if (obj.needRender) {
        obj.render(this.ctx)
      }
    }
  }
}
