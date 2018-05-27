import { CreatableMixin, inject } from '../../lib';

import { default as TimeManager } from './time-manager';

export default class SceneManager extends CreatableMixin<SceneManager>() {

  private timeManager: TimeManager = null;

  private scenes: Map<string, any> = new Map<string, any>();

  protected async _init() {
    this.timeManager = inject('TimeManager');
  }

  public async prepareScene(sceneName: string, data: ISceneData) {

  }

  public startScene(sceneName: string) {

  }
}
