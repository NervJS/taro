import { TaroEventTarget } from '../dom/eventTarget'
import { History } from './history'
import { Location } from './location'
import { nav } from './navigator'

import type _display from '@ohos.display'
import type ohosWindow from '@ohos.window'
import type { TaroDocument } from '../dom/document'

export type { TaroWindow } from '@tarojs/runtime/dist/bom/window'

export class Window extends TaroEventTarget {
  public _doc: TaroDocument
  public __taroAppConfig: any
  public __ohos: typeof ohosWindow
  public __oh_display: typeof _display

  public location: any
  public history: any
  public navigator = nav

  constructor () {
    super()

    this.location = new Location({ window: this })
    this.history = new History(this.location, { window: this })
    this.__ohos = get('NativePackageManager').loadLibrarySync('@ohos.window', [])
    this.__oh_display = get('NativePackageManager').loadLibrarySync('@ohos.display', [['getDefaultDisplaySync']])
  }

  get document (): TaroDocument {
    return this._doc
  }

  get devicePixelRatio () {
    return this.__oh_display.densityPixels
  }

  get getComputedStyle () {
    return this.document.getComputedStyle
  }

  setTimeout (...args: Parameters<typeof setTimeout>) {
    setTimeout(...args)
  }

  clearTimeout (...args: Parameters<typeof clearTimeout>) {
    clearTimeout(...args)
  }
}

export const window = new Window()
export const location = window.location
export const history = window.history
