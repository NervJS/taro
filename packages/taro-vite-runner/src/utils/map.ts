import { isEqual } from 'lodash'

export class UniqueKeyMap<T = any> {
  store: Map<string, T>
  counters: Map<string, number>

  constructor() {
    this.store = new Map()
    this.counters = new Map()
  }

  add(key: string, value: T) {
    if (!this.store.has(key)) {
      this.store.set(key, value)
      return key
    } else if (isEqual(this.store.get(key), value)) {
      return key
    }

    let counter = this.counters.get(key) || 1
    let newKey = `${key}_${counter++}`

    while (this.store.has(newKey)) {
      newKey = `${key}_${counter++}`
    }

    this.counters.set(key, counter)
    this.store.set(newKey, value)
    return newKey
  }

  get(key: string) {
    return this.store.get(key)
  }

  has(key: string) {
    return this.store.has(key)
  }

  // 获取所有存储的内容
  getAll() {
    return Object.fromEntries(this.store)
  }
}
