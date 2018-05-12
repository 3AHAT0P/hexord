import { Queue } from './'

export default class PriorityQueue extends Queue {
  __biuldItem(priority, ...args) {
    let res = super.__biuldItem(...args)
    res.priority = priority
    return res
  }
  add(priority, data) {
    switch (this.length) {
      case 0:
        this.head = this.tail = this.__biuldItem(priority, data)
        break;
      case 1:
        if (this.head.priority >= priority) {
          this.head = this.tail.prev = this.__biuldItem(priority, data, null, this.tail)
        } else {
          this.head.next = this.tail = this.__biuldItem(priority, data, this.head)
        }
        break;
      default:
        let item = this.head
        if (item.priority >= priority) {
          this.head = item.prev = this.__biuldItem(priority, data, null, item)
        } else {
          while (true) {
            item = item.next
            if (item == null) {
              this.tail = this.tail.next = this.__biuldItem(priority, data, this.tail)
              break
            }
            if (item.priority >= priority) {
              item.prev = item.prev.next = this.__biuldItem(priority, data, item.prev, item)
              break
            }
          }
        }
    }
    return this.length++
  }
  getMax() {
    return this.pop()
  }
  getMin() {
    return this.shift()
  }
  push(data, priority=0) {
    return this.add(priority, data)
  }
  unshift(data, priority=0) {
    return this.add(priority, data)
  }
}
