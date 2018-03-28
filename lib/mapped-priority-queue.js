import { PriorityQueue } from './'

export default class MappedPriorityQueue extends PriorityQueue {
  constructor() {
    super()
    this.map = {}
  }
  add(priority, data) {
    this.map[data.id] = data
    return super.add(priority, data)
  }
  pop() {
    let res = super.pop()
    if (res != null)
      delete this.map[res.id]
    return res
  }
  shift() {
    let res = super.shift()
    if (res != null)
      delete this.map[res.id]
    return res
  }
  getById(id) {
    return this.map[id]
  }
  removeById(id) {
    delete this.map[id]
    let item = this.head
    if (item.id !== id) while ((item = item.next) != null && item.id !== id) ;
    if (item != null) {
      item.prev.next = item.next
      item.next.prev = item.prev
    }
  }
  has(id) {
    return this.map[id] != null
  }
}
