import { DOCUMENT_FRAGMENT } from '../constants'
import { options } from '../options'

import type { TaroElement } from '../dom/element'

export function getBoundingClientRectImpl (this: TaroElement): Promise<null> {
  if (!options.miniGlobal) return Promise.resolve(null)
  return new Promise(resolve => {
    const query = options.miniGlobal.createSelectorQuery()
    // ref: https://opendocs.alipay.com/mini/api/na4yun
    if (process.env.TARO_ENV === 'alipay') {
      query.select(`#${this.uid}`).boundingClientRect().exec(res => {
        resolve(res)
      })
      return
    }

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
