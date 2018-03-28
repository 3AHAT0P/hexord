import { AbstractScene } from './';
import {
  BackgroundLayer,
  GridLayer,
  StaticObjectsLayer,
  DynamicObjectsLayer,
  InputLayer,
} from '../layers';

import { Wall } from '../static-objects';
import { Player } from '../dynamic-objects';

const asyncRequestAnimationFrame = async (cb) => {
  await new Promise((resolve) => {
    requestAnimationFrame(async () => {
      await cb();
      resolve();
    })
  })
}

export default class MainScene extends AbstractScene {

  get background() {
    const canvas = new OffscreenCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "hsla(28, 87%, 67%, 1)";
    ctx.fillRect(0, 0, this.width, this.height);
    return canvas.transferToImageBitmap();
  }

  async _init() {
    await this._applyStyles();
    await this._initLayers();
    await this._prerender();
  }

  async _applyStyles() {
    await asyncRequestAnimationFrame(() => {
      this.style.position = `relative`;
      this.style.width = `${this.width}px`;
      this.style.height = `${this.height}px`;
    });
  }

  async _initLayers() {
    this.notReadyLayerCount = 0;
    this._createLayer('Background', BackgroundLayer, this, this.width, this.height, this.background);
    this._createLayer('Grid', GridLayer, this, this.width, this.height, {
      width: 30,
      border: 1,
      borderColor: 'hsla(0, 0%, 100%, .2)',
      hoverColor: 'hsla(0, 0%, 0%, .1)',
      clearColor: 'hsla(0, 0%, 100%, 1)'
    });
    this._createLayer('StaticObjects', StaticObjectsLayer, this, this.width, this.height);
    this._createLayer('DynamicObjects', DynamicObjectsLayer, this, this.width, this.height);
    this._createLayer('Input', InputLayer, this, this.width, this.height);
  }

  async _createLayer(key, Class, ...args) {
    ++this.notReadyLayerCount;
    const layer = new Class(...args);
    this.layers.set(key, layer);
    layer.on('ready', this._layerReady.bind(this));
  }

  _layerReady() {
    if (--this.notReadyLayerCount === 0) {
      for (const [_, layer] of this.layers) {
        this.append(layer.element);
      }
      this.emit('ready');
    }
  }

  async _prerender() {
    const gridLayer = this.layers.get('Grid');
    const staticLayer = this.layers.get('StaticObjects');
    const dynamicLayer = this.layers.get('DynamicObjects');
    for (let i = 0; i < 10; ++i) {
      dynamicLayer.connectObject(new Wall(this, 20, 20, null, gridLayer.getCell(i,9), gridLayer));
    }

    const player = new Player(this, 15, 15, null, gridLayer.getCell(5,5), gridLayer);
    dynamicLayer.connectObject(player);
  }

  constructor() {
    super();
    this.layers = new Map();
    this.width = 640;
    this.height = 320;
    setTimeout(this._init());
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

  findPath(from, to) {
    return this.layers.get('Grid').getPath(from, to);
  }
}

customElements.define('main-scene', MainScene);
