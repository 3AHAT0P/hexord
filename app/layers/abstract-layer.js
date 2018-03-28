import { EventedMixin } from '../../lib/mixins'

export default class AbstractLayer extends EventedMixin() {
  constructor(scene, width, height) {
    super();
    this.on('init', this.init.bind(this))
    this.scene = scene;
    this.width = width
    this.height = height
    this.emit('init')
  }

  init() {
    this._initCanvas();
    requestAnimationFrame(this.prerender.bind(this));
  }

  _initCanvas() {
    this.element = document.createElement('canvas')
    this.element.width = this.width
    this.element.height = this.height
    this.element.style.position = 'absolute'
    this.element.style.top = '0'
    this.element.style.left = '0'
    this.ctx = this.element.getContext('2d')
    this.emit('ready')
  }

  prerender() {

  }

  render() {
  }
}
