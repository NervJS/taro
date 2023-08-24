import { Location } from '@tarojs/runtime/dist/runtime.esm'

import { TaroEventTarget } from '../dom/eventTarget'

import type { TaroDocument } from '../dom/document'

class Window extends TaroEventTarget {
  public _doc: TaroDocument
  public __taroAppConfig: any

  public location: Location

  constructor () {
    super()

    // @ts-ignore
    this.location = new Location({ window: this })
  }

  get document (): TaroDocument {
    return this._doc
  }

  setTimeout (...args: Parameters<typeof setTimeout>) {
    setTimeout(...args)
  }

  clearTimeout (...args: Parameters<typeof clearTimeout>) {
    clearTimeout(...args)
  }
}

export { Location, Window }

export const window = new Window()
export const location = window.location
