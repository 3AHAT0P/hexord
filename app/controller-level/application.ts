import {
  EventEmitter,
  bind,
  wait,
} from "../../lib";

import {
  ActionStore,
  PlayerStore,
  SubjectStore,
  TurnStore,
  WolfStore,
} from "../model-level/stores";

// import { GameController } from "./";

export default class Application {
  public static async create() {
    const instance = new this();
    await instance._init();
    return instance;
  }

  public services = new Map<string, any>();

  private async _init() {
    this.services.set("DOMService", document);
    this.services.set("EventEmitter", new EventEmitter());
    // this.services.set("GameController", new GameController());
    await this._initStores();
  }

  private async _initStores() {
    this.services.set("ActionStore", new ActionStore());
    this.services.set("SubjectStore", new SubjectStore());
    this.services.set("PlayerStore", new PlayerStore());
    this.services.set("TurnStore", new TurnStore());
    this.services.set("WolfStore", new WolfStore());
    await wait(1);
  }

  constructor() {
    (window as any)[Symbol.for("app")] = this;
  }

  @bind
  public run() {
    // this.services.get("GameController").start();
  }
}
