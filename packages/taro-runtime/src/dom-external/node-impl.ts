import { inject, injectable } from 'inversify'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { ElementNames, InstanceNamedFactory } from '../interface'
import { setInnerHTML } from '../dom-external/inner-html/html'
import { cloneNode, insertAdjacentHTMLImpl, contains } from './node'

import type { Ctx, GetDoc } from '../interface'
import type { TaroDocument } from '../dom/document'

declare const ENABLE_INNER_HTML: boolean
declare const ENABLE_ADJACENT_HTML: boolean
declare const ENABLE_CLONE_NODE: boolean
declare const ENABLE_CONTAINS: boolean

@injectable()
export class TaroNodeImpl {
  public getDoc: GetDoc

  constructor (// eslint-disable-next-line @typescript-eslint/indent
    @inject(SERVICE_IDENTIFIER.TaroElementFactory) getElement: InstanceNamedFactory
  ) {
    this.getDoc = () => getElement<TaroDocument>(ElementNames.Document)()
  }

  public bind (ctx: Ctx) {
    const getDoc = this.getDoc

    if (ENABLE_INNER_HTML) {
      bindInnerHTML(ctx, getDoc)

      if (ENABLE_ADJACENT_HTML) {
        ctx.insertAdjacentHTML = insertAdjacentHTMLImpl.bind(ctx, getDoc)
      }
    }

    if (ENABLE_CLONE_NODE) {
      ctx.cloneNode = cloneNode.bind(ctx, getDoc)
    }

    if (ENABLE_CONTAINS) {
      ctx.contains = contains.bind(ctx)
    }
  }
}

function bindInnerHTML (ctx, getDoc) {
  Object.defineProperty(ctx, 'innerHTML', {
    configurable: true,
    enumerable: true,
    set (html: string) {
      setInnerHTML.call(ctx, ctx, html, getDoc)
    },
    get (): string {
      return ''
    }
  })
}
