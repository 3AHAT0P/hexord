import { EventEmitter } from '../lib';
import { next } from '../lib/utils';
import { bind } from '../lib/decorators';

import { GameController } from './';

export default class Application {

  services = new Map();

  @bind
  _init() {
    this.services.set('DOMService', document);
    this.services.set('EventEmitter', new EventEmitter());
    this.services.set('GameController', new GameController());
    next(this.startGame);
  }

  constructor() {
    window[Symbol.for('app')] = this;
    next(this._init);
  }

  @bind
  startGame() {
    this.services.get('GameController').start();
  }
}
