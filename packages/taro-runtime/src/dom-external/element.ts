import { options } from '../options'
import { ElementNames } from '../interface'
import { DOCUMENT_FRAGMENT } from '../constants'

import type { Ctx } from '../interface'

export function getBoundingClientRectImpl (): Promise<null> {
  if (!options.miniGlobal) return Promise.resolve(null)
  return new Promise(resolve => {
    const query = options.miniGlobal.createSelectorQuery()
    query.select(`#${this.uid}`).boundingClientRect(res => {
      resolve(res)
    }).exec()
  })
}

export function getTemplateContent (ctx: Ctx): string | undefined {
  if (ctx.nodeName === 'template') {
    const content = ctx._getElement(ElementNames.Element)(DOCUMENT_FRAGMENT)
    content.childNodes = ctx.childNodes
    ctx.childNodes = [content]
    content.parentNode = ctx
    content.childNodes.forEach(nodes => {
      nodes.parentNode = content
    })
    return content
  }
}
