import {
  EventEmitter,
  CreatableMixin,
  bind,
  wait,
} from '../../lib';

import {
  ActionStore,
  PlayerStore,
  SubjectStore,
  TurnStore,
  WolfStore,
} from '../model-level/stores';

import { default as TimeManager } from './time-manager';

import { default as GameController } from './game-controller';

export default class Application extends CreatableMixin<Application>() {

  public services = new Map<string, any>();

  private async _initStores() {
    this.services.set('ActionStore', new ActionStore());
    this.services.set('SubjectStore', new SubjectStore());
    this.services.set('PlayerStore', new PlayerStore());
    this.services.set('TurnStore', new TurnStore());
    this.services.set('WolfStore', new WolfStore());
    await wait(1);
  }

  protected async _init() {
    this.services.set('DOMService', document);
    this.services.set('EventEmitter', new EventEmitter());
    this.services.set('TimeManager', new TimeManager());
    this.services.set('GameController', await GameController.create());
    await this._initStores();
  }

  constructor() {
    super();
    (window as any)[Symbol.for('app')] = this;
  }

  @bind
  public run() {
    this.services.get('TimeManager').start();
    // this.services.get('GameController').start();
  }
}
