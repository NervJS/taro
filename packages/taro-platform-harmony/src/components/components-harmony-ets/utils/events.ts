import { EventOptions, TaroElement, TaroEvent } from '@tarojs/runtime'

export function createTaroEvent(type: string, opts: Partial<EventOptions> = {}, node?: TaroElement) {
  opts.bubbles ||= true
  opts.cancelable ||= true
  const e = new TaroEvent(type, opts as Required<EventOptions>)

  if (node) {
    const properties: Record<string, PropertyDescriptor> = {}
    properties.target = properties.currentTarget = {
      get() {
        return node
      }
    }
    Object.defineProperties(e, properties)
  }
  for (const key in opts) {
    if (['bubbles', 'cancelable'].includes(key)) {
      continue
    }
    e[key] = opts[key]
  }
  return e
}
