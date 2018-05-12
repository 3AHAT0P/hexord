import { INode } from "./";

export default interface IPriorityNode extends INode {
  priority: number;
  data: any;
  prev: IPriorityNode;
  next: IPriorityNode;
}
