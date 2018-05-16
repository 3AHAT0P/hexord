import {
  EventEmitter,
  bind,
  deferred, next,
} from "../../lib";

// import {
//   ActionStore,
//   PlayerStore,
//   SubjectStore,
//   TurnStore,
//   WolfStore,
// } from "../model-level/stores";

// import { GameController } from "./";

export default class Application {
  public static create() {
    const instance = new this();
    instance._init();
    return instance;
  }

  public ready = deferred();

  public services = new Map();

  private _init() {
    this.services.set("DOMService", document);
    this.services.set("EventEmitter", new EventEmitter());
    // this.services.set("GameController", new GameController());
    this._initStores();
  }

  private _initStores() {
    // this.services.set("ActionStore", new ActionStore());
    // this.services.set("SubjectStore", new SubjectStore());
    // this.services.set("PlayerStore", new PlayerStore());
    // this.services.set("TurnStore", new TurnStore());
    // this.services.set("WolfStore", new WolfStore());
    next(this.ready.resolve.bind(true));
  }

  constructor() {
    (window as any)[Symbol.for("app")] = this;
  }

  @bind
  public startGame() {
    this.services.get("GameController").start();
  }
}
