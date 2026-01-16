import { PLATFORM_TYPE } from '@tarojs/shared'

import { TaroElement } from '../dom/element'
import { TaroNode } from '../dom/node'
import { setInnerHTML } from '../dom-external/inner-html/html'
import { getBoundingClientRectImpl, getTemplateContent } from './element'
import { cloneNode, contains, insertAdjacentHTML } from './node'

declare const ENABLE_INNER_HTML: boolean
declare const ENABLE_ADJACENT_HTML: boolean
declare const ENABLE_CLONE_NODE: boolean
declare const ENABLE_CONTAINS: boolean

declare const ENABLE_SIZE_APIS: boolean
declare const ENABLE_TEMPLATE_CONTENT: boolean

if (process.env.TARO_PLATFORM !== PLATFORM_TYPE.WEB && process.env.TARO_PLATFORM !== PLATFORM_TYPE.HARMONY) {
  if (ENABLE_INNER_HTML) {
    TaroNode.extend('innerHTML', {
      set (html: string) {
        setInnerHTML.call(this, this, html)
      },
      get (): string {
        return ''
      }
    })

    if (ENABLE_ADJACENT_HTML) {
      TaroNode.extend('insertAdjacentHTML', insertAdjacentHTML)
    }
  }

  if (ENABLE_CLONE_NODE) {
    TaroNode.extend('cloneNode', cloneNode)
  }

  if (ENABLE_CONTAINS) {
    TaroNode.extend('contains', contains)
  }

  if (ENABLE_SIZE_APIS) {
    TaroElement.extend('getBoundingClientRect', getBoundingClientRectImpl)
  }

  if (ENABLE_TEMPLATE_CONTENT) {
    TaroElement.extend('content', {
      get () {
        return getTemplateContent(this)
      }
    })
  }
}
