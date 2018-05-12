import CoreComponentMixin from './core-component'

import { updateProtoMap } from '../utils';

export default function AbstractElementMixin(BaseClass = HTMLElement) {
  if (!updateProtoMap(BaseClass, 'AbstractElementMixin')) return BaseClass;

  return class AbstractElement extends CoreComponentMixin(BaseClass) {
    _block = new Map()

    get _id() {
      return `block${this.super._id}`;
    }
  }
}
