import { INode, IPriorityNode, Queue } from "./";

export default class PriorityQueue extends Queue {
  public head: IPriorityNode = null;
  public tail: IPriorityNode = null;

  protected __buildItem(priority: number, data: any, prev: INode = null, next: INode = null): IPriorityNode {
    const res: IPriorityNode = super.__buildItem(data, prev, next) as IPriorityNode;
    res.priority = priority;
    return res;
  }

  public add(data: any, priority: number): number {
    switch (this.length) {
      case 0:
        this.head = this.tail = this.__buildItem(priority, data);
        break;
      case 1:
        if (this.head.priority >= priority) {
          this.head = this.tail.prev = this.__buildItem(priority, data, null, this.tail);
        } else {
          this.head.next = this.tail = this.__buildItem(priority, data, this.head);
        }
        break;
      default:
        let item = this.head;
        if (item.priority >= priority) {
          this.head = item.prev = this.__buildItem(priority, data, null, item);
        } else {
          while (true) {
            item = item.next;
            if (item == null) {
              this.tail = this.tail.next = this.__buildItem(priority, data, this.tail);
              break;
            }
            if (item.priority >= priority) {
              item.prev = item.prev.next = this.__buildItem(priority, data, item.prev, item);
              break;
            }
          }
        }
    }
    return this.length++;
  }

  public getMax(): any {
    return this.pop();
  }

  public getMin(): any {
    return this.shift();
  }

  public push(data: any, priority: number = 0): number {
    return this.add(priority, data);
  }

  public unshift(data: any, priority: number = 0): number {
    return this.add(priority, data);
  }
}
