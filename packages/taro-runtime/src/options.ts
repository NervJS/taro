import { TaroText } from './dom/text'
import { Text, Element } from './dom/html/parser'
import { TaroElement } from './dom/element'
import { PageInstance } from './dsl/instance'

interface Options<T> {
  prerender: boolean
  debug: boolean
  html: {
    skipElements: Set<string>
    voidElements: Set<string>
    closingElements: Set<string>
    transformText?: (taroText: TaroText, text: Text) => TaroText
    transformElement?: (taroElement: TaroElement, element: Element) => TaroElement
  },
  UNSAFE_getFrameworkLifecycle: (instance: T, lifecyle: keyof PageInstance) => Function | undefined | Array<Function>
}

export const options: Options<any> = {
  prerender: true,
  debug: false,
  // html 只影响 Element#innerHTML API
  html: {
    skipElements: new Set(['style', 'script']),
    voidElements: new Set([
      '!doctype', 'area', 'base', 'br', 'col', 'command',
      'embed', 'hr', 'img', 'input', 'keygen', 'link',
      'meta', 'param', 'source', 'track', 'wbr'
    ]),
    closingElements: new Set([
      'html', 'head', 'body', 'p', 'dt', 'dd', 'li', 'option',
      'thead', 'th', 'tbody', 'tr', 'td', 'tfoot', 'colgroup'
    ])
  },
  UNSAFE_getFrameworkLifecycle (instance, lifecycle: keyof PageInstance) {
    const isReact = process.env.FRAMEWORK !== 'vue' // isReact means all kind of react-like library
    if (isReact) {
      if (lifecycle === 'onShow') {
        lifecycle = 'componentDidShow'
      } else if (lifecycle === 'onHide') {
        lifecycle = 'componentDidHide'
      }
    }

    return isReact ? instance[lifecycle] : instance.$options[lifecycle]
  }
}
