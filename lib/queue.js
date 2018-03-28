export default class Queue {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }
  __biuldItem(data, prev=null, next=null) {
    return { data, prev, next }
  }
  push(data) {
    switch (this.length) {
      case 0:
        this.tail = this.head = this.__biuldItem(data)
        break;
      default:
        this.tail = this.tail.next = this.__biuldItem(data, this.tail)
    }
    return this.length++
  }
  pop() {
    let res = null
    switch (this.length) {
      case 0:
        break;
      case 1:
        res = this.tail.data
        this.tail = this.head = null
        this.length--
        break;
      default:
        res = this.tail.data
        this.tail = this.tail.prev
        this.tail.next = null
        this.length--
    }
    return res
  }
  unshift(data) {
    switch (this.length) {
      case 0:
        this.head = this.tail = this.__biuldItem(data)
        break;
      default:
        this.head = this.head.prev = this.__biuldItem(data, null, this.head)
    }
    return this.length++
  }
  shift() {
    let res = null
    switch (this.length) {
      case 0:
        break;
      case 1:
        res = this.head.data
        this.head = this.tail = null
        this.length--
        break;
      default:
        res = this.head.data
        this.head = this.head.next
        this.head.prev = null
        this.length--
    }
    return res
  }
}
