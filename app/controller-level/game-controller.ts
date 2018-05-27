import { CreatableMixin, inject } from '../../lib';

import { SubjectModel } from '../model-level/models';
import { SubjectStore } from '../model-level/stores';

import { default as SceneManager } from './scene-manager';

const SCENES = ['main'];

export default class GameController extends CreatableMixin<GameController>() {
  private sceneManager: SceneManager = null;

  private async _getCurrentUserPlayerId(): Promise<string> {
    return (window as any).playerId;
  }

  private async _loadData(): Promise<ISceneData> {
    const subjectStore = inject<SubjectStore>('SubjectStore');

    const player = await subjectStore.getOne(await this._getCurrentUserPlayerId());
    return {
      mapTemplate: 1,
      teams: [
        [player],
        [],
      ],
    };
  }

  protected async _init() {
    this.sceneManager = await SceneManager.create();
  }

  public async start() {
    const data = await this._loadData();
    await this.sceneManager.prepareScene('main', data);
    this.sceneManager.startScene('main');
  }
}
