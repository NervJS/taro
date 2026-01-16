export const entryCache = new Map<string, any>()

export default function () {
  const callback = this.async()
  const { name } = this.getOptions()
  if (name && entryCache.has(name)) {
    const content = entryCache.get(name)
    // just in case, delete cache in next tick
    setImmediate(() => entryCache.delete(name))
    callback(null, content!.source, content!.map)
  }
}
