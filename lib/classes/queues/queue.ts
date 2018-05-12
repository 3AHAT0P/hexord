import { INode } from "./";

export default class Queue {
  public head: INode = null;
  public tail: INode = null;
  public length: number = 0;

  protected __buildItem(data: any, prev: INode = null, next: INode = null): INode {
    return { data, prev, next };
  }

  public push(data: any): number {
    switch (this.length) {
      case 0:
        this.tail = this.head = this.__buildItem(data);
        break;
      default:
        this.tail = this.tail.next = this.__buildItem(data, this.tail);
    }
    return this.length++;
  }

  public pop(): any {
    let res: any = null;
    switch (this.length) {
      case 0:
        break;
      case 1:
        res = this.tail.data;
        this.tail = this.head = null;
        this.length--;
        break;
      default:
        res = this.tail.data;
        this.tail = this.tail.prev;
        this.tail.next = null;
        this.length--;
    }
    return res;
  }
  public unshift(data: any): number {
    switch (this.length) {
      case 0:
        this.head = this.tail = this.__buildItem(data);
        break;
      default:
        this.head = this.head.prev = this.__buildItem(data, null, this.head);
    }
    return this.length++;
  }
  public shift(): any {
    let res: any = null;
    switch (this.length) {
      case 0:
        break;
      case 1:
        res = this.head.data;
        this.head = this.tail = null;
        this.length--;
        break;
      default:
        res = this.head.data;
        this.head = this.head.next;
        this.head.prev = null;
        this.length--;
    }
    return res;
  }
}
