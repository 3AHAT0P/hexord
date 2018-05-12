import CoreComponentMixin from './core-component'

import { updateProtoMap } from '../utils';

export default function AbstractBlockMixin(BaseClass = HTMLElement) {
  const SuperClass = class extends BaseClass {};
  if (!updateProtoMap(SuperClass, 'AbstractBlockMixin')) return BaseClass;

  return class AbstractBlock extends CoreComponentMixin(SuperClass) {
    _elements = new Map()

    get _id() {
      return `block${this.super._id}`;
    }

    renderElement(elementName, {attrs, model, block} = {}) {
      const element = this.renderComponent(elementName, {attrs, model, block});
      this._elements.set(elementName, element);
      return element;
    }
  }
}
