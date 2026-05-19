export const entryCache = new Map<string, any>()

export default function () {
  const callback = this.async()
  const { name } = this.getOptions()
  if (name && entryCache.has(name)) {
    const content = entryCache.get(name)
    // just in case, delete cache in next tick
    setImmediate(() => entryCache.delete(name))
    callback(null, content!.source, content!.map)
  } else {
    // 当 webpack 持久化缓存命中时，entryCache 为空，需要兜底返回空字符串
    callback(null, '')
  }
}
