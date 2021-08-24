import { inject, injectable } from 'inversify'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { ElementNames, InstanceNamedFactory } from '../interface'
import { setInnerHTML } from '../dom-external/inner-html/html'
import { cloneNode, insertAdjacentHTMLImpl } from './node'

import type { Ctx, GetDoc } from '../interface'
import type { TaroDocument } from '../dom/document'
import type { IPosition } from './node'

declare const ENABLE_INNER_HTML: boolean
declare const ENABLE_ADJACENT_HTML: boolean
declare const ENABLE_CLONE_NODE: boolean

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
        bindAdjacentHTML(ctx, getDoc)
      }
    }
    if (ENABLE_CLONE_NODE) {
      ctx.cloneNode = cloneNode.bind(ctx, ctx, getDoc)
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

function bindAdjacentHTML (ctx, getDoc) {
  ctx.insertAdjacentHTML = function (position: IPosition, html: string) {
    insertAdjacentHTMLImpl.call(ctx, position, html, getDoc)
  }
}
