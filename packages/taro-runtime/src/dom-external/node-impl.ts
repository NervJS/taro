import { isFunction, warn } from '@tarojs/shared'
import { inject, injectable, optional } from 'inversify'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { ElementNames, InstanceNamedFactory } from '../interface'

import type { Ctx, GetDoc } from '../interface'
import type { setInnerHTML } from '../dom-external/inner-html/html'
import type { TaroDocument } from '../dom/document'
import type { insertAdjacentHTMLImpl, IPosition } from './node'

type SetInnerHTML = typeof setInnerHTML
type InsertAdjacentHTMLImpl = typeof insertAdjacentHTMLImpl

@injectable()
export class TaroNodeImpl {
  ctx: Ctx
  public getDoc: GetDoc
  public innerHTMLImpl: SetInnerHTML
  public adjacentImpl: InsertAdjacentHTMLImpl

  constructor (// eslint-disable-next-line @typescript-eslint/indent
    @inject(SERVICE_IDENTIFIER.TaroElementFactory) getElement: InstanceNamedFactory,
    @inject(SERVICE_IDENTIFIER.InnerHTMLImpl) @optional() innerHTMLImpl: SetInnerHTML,
    @inject(SERVICE_IDENTIFIER.insertAdjacentHTMLImpl) @optional() adjacentImpl: InsertAdjacentHTMLImpl
  ) {
    this.getDoc = () => getElement<TaroDocument>(ElementNames.Document)()
    this.innerHTMLImpl = innerHTMLImpl
    this.adjacentImpl = adjacentImpl
  }

  public bind (ctx: Ctx) {
    this.ctx = ctx
    this.bindInnerHTML()
    this.bindAdjacentHTML()
  }

  private bindInnerHTML () {
    const { ctx, innerHTMLImpl: impl, getDoc } = this
    Object.defineProperty(ctx, 'innerHTML', {
      configurable: true,
      enumerable: true,
      set (html: string) {
        if (isFunction(impl)) {
          impl.call(ctx, ctx, html, getDoc)
        } else {
          process.env.NODE_ENV !== 'production' && warn(true, '请实现 node.innerHTML')
        }
      },
      get (): string {
        return ''
      }
    })
  }

  private bindAdjacentHTML () {
    const { ctx, adjacentImpl: impl, getDoc } = this
    ctx.insertAdjacentHTML = function (position: IPosition, html: string) {
      if (isFunction(impl)) {
        impl.call(ctx, position, html, getDoc)
      } else {
        process.env.NODE_ENV !== 'production' && warn(true, '请实现 node.insertAdjacentHTML')
      }
    }
  }
}
