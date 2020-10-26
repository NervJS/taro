export default class SimpleMap {
  constructor () {
    this.cache = []
    this.size = 0
  }

  set (k, v) {
    const len = this.cache.length
    if (!len) {
      this.cache.push({ k, v })
      this.size += 1
      return
    }
    for (let i = 0; i < len; i++) {
      const item = this.cache[i]
      if (item.k === k) {
        item.v = v
        return
      }
    }
    this.cache.push({ k, v })
    this.size += 1
  }

  get (k) {
    const len = this.cache.length
    if (!len) {
      return
    }
    for (let i = 0; i < len; i++) {
      const item = this.cache[i]
      if (item.k === k) {
        return item.v
      }
    }
  }

  has (k) {
    const len = this.cache.length
    if (!len) {
      return false
    }
    for (let i = 0; i < len; i++) {
      const item = this.cache[i]
      if (item.k === k) {
        return true
      }
    }
    return false
  }

  delete (k) {
    const len = this.cache.length
    for (let i = 0; i < len; i++) {
      const item = this.cache[i]
      if (item.k === k) {
        this.cache.splice(i, 1)
        this.size -= 1
        return true
      }
    }
    return false
  }

  clear () {
    let len = this.cache.length
    this.size = 0
    if (!len) {
      return
    }
    while (len) {
      this.cache.pop()
      len--
    }
  }
}
