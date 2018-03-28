import { MainScene } from './scenes'

import { inject } from '../lib/utils'

export default class GameController {
  constructor() {
    setTimeout(this.init.bind(this));
    this.gameIsStarted = false;
  }

  initInjects() {
    this.dom = inject('DOMService');
  }

  init() {
    this.initInjects();
    // this.activeScene = new MainScene();
    this.activeSceneIsReady = false;
    this.activeScene = this.dom.createElement('main-scene');
    this.activeScene.on('ready', () => {
      this.activeSceneIsReady = true;
      this.runScene();
    })
    this.dom.body.append(this.activeScene)
  }

  runScene(waitSceneReadyState = false) {
    if (this.gameIsStarted && this.activeSceneIsReady) {
      this.activeScene.run();
    }
  }

  start() {
    this.gameIsStarted = true;
    this.runScene();
  }
}
