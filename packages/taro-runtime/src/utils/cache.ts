/**
 * 一个小型缓存池，用于在切换页面时，存储一些上下文信息
 */

export class RuntimeCache<T> {
  name: string
  cache = new Map<string, T>()

  constructor (name: string) {
    this.name = name
  }

  has (identifier: string) {
    return this.cache.has(identifier)
  }

  set (identifier: string, ctx: T) {
    if (identifier && ctx) {
      this.cache.set(identifier, ctx)
    }
  }

  get (identifier: string): T | undefined {
    if (this.has(identifier)) return this.cache.get(identifier)
  }

  delete (identifier: string) {
    this.cache.delete(identifier)
  }
}
