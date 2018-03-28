import { AbstractScene } from './'
import {
  BackgroundLayer,
  GridLayer,
  StaticObjectsLayer,
  DynamicObjectsLayer,
  InputLayer,
} from '../layers'

import { Wall } from '../static-objects'
import { Player } from '../dynamic-objects'

export default class MainScene extends AbstractScene {
  constructor() {
    super()
    setTimeout(this.init());
    this.layers = new Map();
    this.width = 640;
    this.height = 320;
  }

  async init() {
    await this.applyStyles();
    await this.initLayers();
    await this.prerender();
  }

  applyStyles() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        this.style.position = `relative`;
        this.style.width = `${this.width}px`;
        this.style.height = `${this.height}px`;
        resolve()
      })
    })
  }

  async initLayers() {
    this.notReadyLayerCount = 0;
    this.createLayer('Background', BackgroundLayer, this, this.width, this.height, this.background);
    this.createLayer('Grid', GridLayer, this, this.width, this.height, {
      width: 30,
      border: 1,
      borderColor: 'hsla(0, 0%, 100%, .2)',
      hoverColor: 'hsla(0, 0%, 0%, .1)',
      clearColor: 'hsla(0, 0%, 100%, 1)'
    });
    this.createLayer('StaticObjects', StaticObjectsLayer, this, this.width, this.height);
    this.createLayer('DynamicObjects', DynamicObjectsLayer, this, this.width, this.height);
    this.createLayer('Input', InputLayer, this, this.width, this.height);
  }

  async createLayer(key, Class, ...args) {
    ++this.notReadyLayerCount;
    let layer = null;
    this.layers.set(key, layer = new Class(...args))
    layer.on('ready', this.layerReady.bind(this))
  }

  layerReady() {
    if (--this.notReadyLayerCount === 0) {
      for (const [_, layer] of this.layers) {
        this.append(layer.element);
      }
      this.emit('ready')
    }
  }

  async prerender() {
    const gridLayer = this.layers.get('Grid')
    const staticLayer = this.layers.get('StaticObjects')
    const dynamicLayer = this.layers.get('DynamicObjects')
    for (let i = 0; i < 10; ++i) {
      dynamicLayer.connectObject(new Wall(this, 20, 20, null, gridLayer.getCell(i,9), gridLayer));
    }

    const player = new Player(this, 15, 15, null, gridLayer.getCell(5,5), gridLayer);
    dynamicLayer.connectObject(player);
  }

  run() {
    this.render();
  }

  async render() {
    for (const [_, layer] of this.layers) {
      layer.render();
    }
    requestAnimationFrame(this.render.bind(this));
  }

  get background() {
    const canvas = new OffscreenCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "hsla(28, 87%, 67%, 1)";
    ctx.fillRect(0, 0, this.width, this.height);
    return canvas.transferToImageBitmap();
  }
}

customElements.define('main-scene', MainScene);
