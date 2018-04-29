import { EventEmitter } from '../lib';
import { next, deffered } from '../lib/utils';
import { bind } from '../lib/decorators';

import { GameController } from './';
import {
  ActionStore,
  PlayerStore,
  TurnStore,
  WolfStore,
} from './stores';

export default class Application {
  ready = deffered();

  services = new Map();

  @bind
  _init() {
    this.services.set('DOMService', document);
    this.services.set('EventEmitter', new EventEmitter());
    this.services.set('GameController', new GameController());
    this._initStores();
    next(this.startGame);
  }

  _initStores() {
    this.services.set('ActionStore', new ActionStore());
    this.services.set('PlayerStore', new PlayerStore());
    this.services.set('TurnStore', new TurnStore());
    this.services.set('WolfStore', new WolfStore());
    next(this.ready.resolve.bind(true));
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
