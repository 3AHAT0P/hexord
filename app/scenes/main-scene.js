import { next, nextFrame, randomBetween } from '../../lib/utils';
import { bind } from '../../lib/decorators';

import { AbstractScene } from './';
import {
  BackgroundLayer,
  GridLayer,
  StaticObjectsLayer,
  DynamicObjectsLayer,
  InputLayer,
} from '../layers';

import { Wall, Box } from '../static-objects';
import { Player, AiActor } from '../dynamic-objects';

export default class MainScene extends AbstractScene {
  layers = new Map();
  width = 640;
  height = 480;

  get backgroundSprite() {
    // const canvas = new OffscreenCanvas(this.width, this.height);
    // const ctx = canvas.getContext('2d');
    // ctx.fillStyle = 'hsla(28, 87%, 67%, 1)';
    // ctx.fillRect(0, 0, this.width, this.height);
    // return canvas.transferToImageBitmap();
    return this.loadSprite('/assets/images/grass.png');
  }

  async loadSprite(url) {
    const source = await fetch(url);
    return await createImageBitmap(await source.blob());
  }

  get wallSprite() {
    if (this._wallSprite == null) {
      // const canvas = new OffscreenCanvas(20, 20);
      // const ctx = canvas.getContext('2d');
      // ctx.fillStyle = 'red';
      // ctx.fillRect(0, 0, 20, 20);
      // this._wallSprite = canvas.transferToImageBitmap();
      this._wallSprite = this.loadSprite('/assets/images/stone.png');
    }
    return this._wallSprite;
  }

  get boxSprite() {
    if (this._boxSprite == null) {
      // const canvas = new OffscreenCanvas(20, 20);
      // const ctx = canvas.getContext('2d');
      // ctx.fillStyle = 'red';
      // ctx.fillRect(0, 0, 20, 20);
      // this._boxSprite = canvas.transferToImageBitmap();
      this._boxSprite = this.loadSprite('/assets/images/box.png');
    }
    return this._boxSprite;
  }

  get playerSprite() {
    if (this._playerSprite == null) {
      // const canvas = new OffscreenCanvas(15, 15);
      // const ctx = canvas.getContext('2d');
      // ctx.fillStyle = 'green';
      // ctx.fillRect(0, 0, 15, 15);
      // this._playerSprite = canvas.transferToImageBitmap();
      this._playerSprite = this.loadSprite('/assets/images/player.png');
    }
    return this._playerSprite;
  }

  get aiActorSprite() {
    if (this._aiActorSprite == null) {
      // const canvas = new OffscreenCanvas(15, 15);
      // const ctx = canvas.getContext('2d');
      // ctx.fillStyle = 'blue';
      // ctx.fillRect(0, 0, 15, 15);
      // this._aiActorSprite = canvas.transferToImageBitmap();
      this._aiActorSprite = this.loadSprite('/assets/images/wolf.png');
    }
    return this._aiActorSprite;
  }

  get aiActorClearSprite() {
    if (this._aiActorClearSprite == null) {
      // const canvas = new OffscreenCanvas(15, 15);
      // const ctx = canvas.getContext('2d');
      // ctx.fillStyle = 'blue';
      // ctx.fillRect(0, 0, 15, 15);
      // this._aiActorSprite = canvas.transferToImageBitmap();
      this._aiActorClearSprite = this.loadSprite('/assets/images/wolf-clear.png');
    }
    return this._aiActorClearSprite;
  }

  async buildClearSprite({width, height}) {
    const canvas = new OffscreenCanvas(width + 4, height + 4);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'hsla(255, 100%, 100%, 1)';
    ctx.fillRect(0, 0, width + 4, height + 4);
    return canvas.transferToImageBitmap();
  }


  async getLevelMap(level = 1) {
    return (await fetch(`/assets/levels/${level}.map.json`)).json();
  }

  static _register() {
    customElements.define('main-scene', this);
  }

  @bind
  async _init() {
    nextFrame(this._applyStyles);
    await this._initLayers();
    await this._prerender();
  }

  @bind
  _applyStyles() {
    this.style.position = 'relative';
    this.style.width = `${this.width}px`;
    this.style.height = `${this.height}px`;
  }

  async _initLayers() {
    this.notReadyLayerCount = 0;
    this._createLayer('Background', BackgroundLayer, this, this.width, this.height, await this.backgroundSprite);
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
      for (const [, layer] of this.layers) {
        this.append(layer.element);
      }
      this.emit('ready');
    }
  }

  async _prerender() {
    const gridLayer = this.layers.get('Grid');
    const staticLayer = this.layers.get('StaticObjects');
    const dynamicLayer = this.layers.get('DynamicObjects');

    const wallSpritesHash = {
      main: await this.wallSprite,
      clear: await this.wallSprite
    };

    const playerSpritesHash = {
      main: await this.playerSprite,
      clear: await this.buildClearSprite(await this.playerSprite)
    };

    const wolfSpritesHash = {
      main: await this.aiActorSprite,
      clear: await this.buildClearSprite(await this.aiActorSprite)
    };

    const firstLevelMap = await this.getLevelMap(1);

    for (let i = 0; i < firstLevelMap.length; ++i) {
      const row = firstLevelMap[i];
      for (let j = 0; j < row.length; ++j) {
        const cell = row[j];
        if (cell === 'w') {
          staticLayer.connectObject(new Wall(this, {x: 'center', y: 'center'}, wallSpritesHash, gridLayer.getCell(i,j)));
        } else if (cell === 'p') {
          const player = new Player(this, {x: 'center', y: 'center'}, playerSpritesHash, gridLayer.getCell(i,j));
          dynamicLayer.connectObject(player);
        } else if (cell === 'a') {
          dynamicLayer.connectObject(new AiActor(this, {x: 'center', y: 'center'}, wolfSpritesHash, gridLayer.getCell(i, j)));
        }
      }
    }
  }

  dropBox() {
    this.box = null;
  }

  async _render(buildBox = true) {
    if (buildBox && this.box == null) {
      const gridLayer = this.layers.get('Grid');
      const staticLayer = this.layers.get('StaticObjects');
      let rowId = randomBetween(0, gridLayer.rowCount);
      let columnId = randomBetween(0, gridLayer.columnCount);
      let cell = gridLayer.getCell(rowId, columnId);

      while (!cell.isEmpty) {
        rowId = randomBetween(0, gridLayer.rowCount);
        columnId = randomBetween(0, gridLayer.columnCount);
        cell = gridLayer.getCell(rowId, columnId);
      }

      const boxSpritesHash = {
        main: await this.boxSprite,
        clear: await this.buildClearSprite(await this.boxSprite)
      };

      staticLayer.connectObject(this.box = new Box(this, {x: 'center', y: 'center'}, boxSpritesHash, gridLayer.getCell(rowId,columnId)));
    }
    for (const [, layer] of this.layers) {
      layer.render();
    }
  }

  constructor() {
    super();
    next(this._init);
  }

  async run() {
    this.rendering = true;
    await this._render(false);
    this.rendering = false;
  }

  async update() {
    if (this.rendering) return;
    this.rendering = true;
    await this._render();
    this.rendering = false;
  }

  findPath(from, to) {
    return this.layers.get('Grid').getPath(from, to);
  }

  getNearblyCells(cell) {
    return this.layers.get('Grid').getNearblyCells(cell, 'all');
  }

  getNearblyEmptyCells(cell) {
    return this.layers.get('Grid').getNearblyCells(cell, 'empty');
  }
}
