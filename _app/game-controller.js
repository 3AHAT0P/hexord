import { inject, next, nextFrame } from '../lib/utils';
import { bind } from '../lib/decorators';

import { MainScene } from './scenes';

MainScene._register();

const TURN_PHASES = [
  'direct',
  'review'
];

export default class GameController {
  gameIsStarted = false;

  @bind
  _init() {
    this._initInjections();
    // this.activeScene = new MainScene();
    this.activeSceneIsReady = false;
    this.activeScene = this.dom.createElement('main-scene');
    this.activeScene.on('ready', this._activeSceneOnReady);
    this.dom.body.append(this.activeScene);
  }

  _initInjections() {
    this.dom = inject('DOMService');
  }

  @bind
  _activeSceneOnReady() {
    this.activeSceneIsReady = true;
    this.runScene();
  }

  constructor() {
    next(this._init);
  }

  runScene() {
    if (this.gameIsStarted && this.activeSceneIsReady) {
      this.activeScene.run();
      next(this.turn);
      nextFrame(this.updateScene);
    }
  }

  @bind
  updateScene() {
    this.activeScene.update();
    nextFrame(this.updateScene);
  }

  @bind
  async turn() {
    this.activeScene.startTurn();
    await new Promise((resolve) => this.activeScene.once('endTurn', resolve));
    await this.activeScene.reviewTurn();
    next(this.turn);
  }

  start() {
    this.gameIsStarted = true;
    this.runScene();
  }
}
