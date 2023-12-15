import { getOptions } from 'loader-utils'

export const entryCache = new Map<string, string>()

export default function () {
  const { name } = getOptions(this)
  if (name && entryCache.has(name)) {
    const content = entryCache.get(name)
    entryCache.delete(name)
    return content
  }
}
