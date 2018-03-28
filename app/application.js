import { EventEmitter } from '../lib'

import { GameController } from './'

export default class Application {
  constructor() {
    setTimeout(this.init.bind(this));
    window[Symbol.for('app')] = this;
  }

  init() {
    this.services = new Map();
    this.services.set('DOMService', document);
    this.services.set('EventEmitter', new EventEmitter());
    this.services.set('GameController', new GameController());
    setTimeout(this.startGame.bind(this))
  }

  startGame() {
    this.services.get('GameController').start();
  }
}
