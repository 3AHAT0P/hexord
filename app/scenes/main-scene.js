import { next, nextFrame } from '../../lib/utils';
import { bind } from '../../lib/decorators';

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

export default class MainScene extends AbstractScene {
  layers = new Map();
  width = 640;
  height = 320;

  get backgroundSprite() {
    const canvas = new OffscreenCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "hsla(28, 87%, 67%, 1)";
    ctx.fillRect(0, 0, this.width, this.height);
    return canvas.transferToImageBitmap();
  }

  get wallSprite() {
    if (this._wallSprite == null) {
      const canvas = new OffscreenCanvas(20, 20);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 20, 20);
      this._wallSprite = canvas.transferToImageBitmap();
    }
    return this._wallSprite;
  }

  get playerSprite() {
    if (this._playerSprite == null) {
      const canvas = new OffscreenCanvas(15, 15);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, 15, 15);
      this._playerSprite = canvas.transferToImageBitmap();
    }
    return this._playerSprite;
  }

  @bind
  async _init() {
    nextFrame(this._applyStyles);
    await this._initLayers();
    await this._prerender();
  }

  @bind
  _applyStyles() {
    this.style.position = `relative`;
    this.style.width = `${this.width}px`;
    this.style.height = `${this.height}px`;
  }

  async _initLayers() {
    this.notReadyLayerCount = 0;
    this._createLayer('Background', BackgroundLayer, this, this.width, this.height, this.backgroundSprite);
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
      dynamicLayer.connectObject(new Wall(this, {x: 'center', y: 'center'}, [this.wallSprite], gridLayer.getCell(i,9)));
    }

    const player = new Player(this, {x: 'center', y: 'center'}, [this.playerSprite], gridLayer.getCell(5,5));
    dynamicLayer.connectObject(player);
  }

  async _render() {
    for (const [_, layer] of this.layers) {
      layer.render();
    }
  }

  constructor() {
    super();
    next(this._init);
  }

  run() {
    this._render();
  }

  update() {
    this._render();
  }

  findPath(from, to) {
    return this.layers.get('Grid').getPath(from, to);
  }
}

customElements.define('main-scene', MainScene);
