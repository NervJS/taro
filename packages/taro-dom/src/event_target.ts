import { isArray } from './utils/is'

export class TaroEventTarget {
  protected __handlers: Record<string, Function[]> = {}

  public addEventListener (type: string, handler: Function) {
    const handlers = this.__handlers[type]
    if (isArray(handlers)) {
      handlers.push(handler)
    } else {
      this.__handlers[type] = [handler]
    }
  }

  public removeEventListener (type: string, handler: Function) {
    if (handler == null) {
      return
    }

    const handlers = this.__handlers[type]
    if (!isArray(handlers)) {
      return
    }

    const index = this.findIndex(handlers, handler)
    handlers.splice(index, 1)
  }

  protected findIndex<T> (childeNodes: T[], refChild: T | null) {
    const index = childeNodes.indexOf(refChild)
    if (index === -1) {
      throw new Error('refChild 不属于') // 改进报错
    }

    return index
  }
}
