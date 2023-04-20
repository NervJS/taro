import { DOCUMENT_FRAGMENT } from '../constants'
import { options } from '../options'

import type { TaroElement } from '../dom/element'

export function getBoundingClientRectImpl (this: TaroElement): Promise<null> {
  if (!options.miniGlobal) return Promise.resolve(null)
  return new Promise(resolve => {
    const query = options.miniGlobal.createSelectorQuery()
    query.select(`#${this.uid}`).boundingClientRect(res => {
      resolve(res)
    }).exec()
  })
}

export function getTemplateContent (ctx: TaroElement): TaroElement | undefined {
  if (ctx.nodeName === 'template') {
    const document = ctx.ownerDocument
    const content: TaroElement = document.createElement(DOCUMENT_FRAGMENT)
    content.childNodes = ctx.childNodes
    ctx.childNodes = [content]
    content.parentNode = ctx
    content.childNodes.forEach(nodes => {
      nodes.parentNode = content
    })
    return content
  }
}
