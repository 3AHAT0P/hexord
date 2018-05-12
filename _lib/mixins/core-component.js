import EventedMixin from './evented';

import { UUID, updateProtoMap } from '../utils';

export default function CoreComponentMixin(BaseClass = HTMLElement) {
  const SuperClass = class extends BaseClass {};
  if (!updateProtoMap(SuperClass, 'CoreComponentMixin')) return BaseClass;

  return class CoreComponent extends EventedMixin(SuperClass) {
    get _prefix() {
      return 'a-'
    }

    get _name() {
      return `${this._prefix}block`;
    }

    get _id() {
      if (this._cachedId == null)
        this._cachedId = `_${UUID()}`;
      return this._cachedId;
    }

    get _styleRuleName() {
      if (this._cachedStyleRuleName == null) {
        this._cachedStyleRuleName = `${this._name}#${this._id.replace(/\-/ig, '\\\-')}`;
      }
      return this._cachedStyleRuleName;
    }

    get _style() {
      if (this._cachedStyle == null) {
        this._styleSheet = document.styleSheets[0];
        this._styleIndex = this._styleSheet.cssRules.length;
        this._styleSheet.insertRule(`${this._styleRuleName} {}`, this._styleIndex);
        this._cachedStyle = this._styleSheet.cssRules[this._styleIndex].style;
      }
      return this._cachedStyle;
    }

    static register() {
      customElements.define(this.prototype._name, this);
    }

    constructor() {
      super();
      this.on('init', this.init);
      this.on('applyStyle', this.applyStyle);
      this.on('willMount', this.willMount);
      this.on('didMount', this.didMount);
      this.on('willUnMount', this.willUnMount);
    }

    willMount() {

    }

    didMount() {

    }

    willUnMount() {
      if (this._cachedStyle != null) {
        this._styleSheet.deleteRule(this._styleIndex);
      }
    }

    applyStyle() {
      this._style.display = 'flex';
      this._style.width = '100%';
      this._style.height = '100%';
    }

    init() {
      this.id = this._id;
      this.emit('applyStyle');
      requestAnimationFrame(this.render.bind(this));
    }

    render() {

    }

    renderComponent(tagName, {attrs, model, slots} = {}) {
      const component = document.createElement(tagName);
      const isComponent = component.constructor._protoMap.has('CoreComponentMixin');
      if (isComponent) {
        component.emit('init');
        component.emit('willMount');
      }
      requestAnimationFrame(() => {
        this.append(component);
        if (isComponent) component.emit('didMount');
      });
      return component;
    }

    renderBlock(tagName, options) {
      return this.renderComponent(tagName, options);
    }
  }
}
