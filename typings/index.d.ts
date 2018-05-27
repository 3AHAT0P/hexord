
import { default as SubjectModel } from '../app/model-level/models/subject';

declare global {
  interface IHash {
    [key: string]: any;
  }
  abstract class Hash {
    [key: string]: any;
  }
  type CallBack = (...args: any[]) => any;

  interface ISceneData {
    mapTemplate: number;
    teams: SubjectModel[][];
  }
}

export { };