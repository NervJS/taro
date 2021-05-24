import { isFunction, warn } from '@tarojs/shared'
import { inject, injectable, optional } from 'inversify'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { ElementNames, InstanceNamedFactory } from '../interface'

import type { setInnerHTML } from '../dom-external/inner-html/html'
import type { TaroDocument } from '../dom/document'

type SetInnerHTML = typeof setInnerHTML
interface GetDoc {
  (): TaroDocument
}

@injectable()
export class TaroNodeImpl {
  public innerHTMLImpl: SetInnerHTML
  public getDoc: GetDoc

  constructor (// eslint-disable-next-line @typescript-eslint/indent
    @inject(SERVICE_IDENTIFIER.TaroElementFactory) getElement: InstanceNamedFactory,
    @inject(SERVICE_IDENTIFIER.InnerHTMLImpl) @optional() innerHTMLImpl: SetInnerHTML
  ) {
    this.getDoc = () => getElement<TaroDocument>(ElementNames.Document)()
    this.innerHTMLImpl = innerHTMLImpl
  }

  public bind (ctx: Record<string, any>) {
    this.bindInnerHTML(ctx, this.innerHTMLImpl, this.getDoc)
  }

  private bindInnerHTML (ctx: Record<string, any>, impl: SetInnerHTML, getDoc: GetDoc) {
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
}
