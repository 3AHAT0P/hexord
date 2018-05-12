import { PriorityQueue } from "./";

export default class MappedPriorityQueue extends PriorityQueue {
  private map: Map<any, any> = new Map<any, any>();

  public add(data: any, priority: number): number {
    this.map.set(data.id, data);
    return super.add(priority, data);
  }

  public pop() {
    const res: any = super.pop();
    if (res != null) this.map.delete(res.id);
    return res;
  }
  public shift() {
    const res: any = super.shift();
    if (res != null) this.map.delete(res.id);
    return res;
  }
  public getById(id: any): any {
    return this.map.get(id);
  }
  public removeById(id: any): any {
    this.map.delete(id);
    let item = this.head;
    // tslint:disable-next-line:no-conditional-assignment
    if (item.data.id !== id) while ((item = item.next) != null && item.data.id !== id);
    if (item != null) {
      item.prev.next = item.next;
      item.next.prev = item.prev;
    }
  }
  public has(id: any): boolean {
    return this.map.has(id);
  }
}
