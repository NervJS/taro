import Taro from '@tarojs/api'
import { isFunction, toKebabCase } from '@tarojs/shared'

import { findDOM } from '../../utils'
import { CanvasContext } from '../canvas/CanvasContext'
import { EditorContext } from '../media/EditorContext'
import { NodesRef } from './nodesRef'

type TElement = Document | HTMLElement | Element

interface ISelectorQueryQueue {
  component: TaroGeneral.IAnyObject
  selector: string
  single: boolean
  fields
}

type TSelectorQueryQueueCallback = (res: ISelectorQueryQueue) => void

function filter (fields, dom?: HTMLElement, selector?: string) {
  if (!dom) return null

  const isViewport = selector === '.taro_page'
  const {
    id,
    dataset,
    rect,
    size,
    scrollOffset,
    properties = [],
    computedStyle = [],
    nodeCanvasType,
    node,
    context,
  } = fields
  const res: any = {}

  if (nodeCanvasType && node) {
    const tagName = dom.tagName
    res.node = {
      id: dom.id,
      $taroElement: dom,
    }
    if (/^taro-canvas-core/i.test(tagName)) {
      const type = (dom as any).type! || ''
      res.nodeCanvasType = type
      const canvas = dom.getElementsByTagName('canvas')[0]
      if (/^(2d|webgl)/i.test(type) && canvas) {
        res.node = canvas
      } else {
        res.node = null
      }
    } else if (/^taro-scroll-view-core/i.test(tagName)) {
      // Note https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/ScrollViewContext.html
      res.nodeCanvasType = ''
      res.node = dom
      dom.scrollTo = (dom as any).mpScrollToMethod
      dom.scrollIntoView = (dom as any).mpScrollIntoViewMethod
    } else {
      res.nodeCanvasType = ''
      res.node = dom
    }
  }
  if (context) {
    const tagName = dom.tagName
    // @ts-ignore
    const domName: string = dom.name || ''
    if (/^taro-video-core/i.test(tagName)) {
      // TODO HTMLVideoElement to VideoContext
      res.context = dom as unknown as Taro.VideoContext
    } else if (/^taro-canvas-core/i.test(tagName)) {
      const type = (dom as any).type! || '2d'
      const canvas = dom?.querySelector('canvas') as HTMLCanvasElement
      const ctx = canvas?.getContext(type) as CanvasRenderingContext2D
      res.context = new CanvasContext(canvas, ctx)
    } else if (/^taro-live-player-core/i.test(tagName)) {
      console.error('暂时不支持通过 NodesRef.context 获取 LivePlayerContext')
    } else if (/^taro-editor-core/i.test(tagName) || /^taro-editor-core/i.test(domName)) {
      res.context = new EditorContext()
    } else if (/^taro-map-core/i.test(tagName)) {
      console.error('暂时不支持通过 NodesRef.context 获取 MapContext')
    }
  }
  if (id) res.id = isViewport ? '' : dom.id
  if (dataset) res.dataset = Object.assign({}, dom.dataset)
  if (rect || size) {
    const { left, right, top, bottom, width, height } = dom.getBoundingClientRect()
    if (rect) {
      if (!isViewport) {
        res.left = left
        res.right = right
        res.top = top
        res.bottom = bottom
      } else {
        res.left = 0
        res.right = 0
        res.top = 0
        res.bottom = 0
      }
    }
    if (size) {
      if (!isViewport) {
        res.width = width
        res.height = height
      } else {
        res.width = dom.clientWidth
        res.height = dom.clientHeight
      }
    }
  }
  if (scrollOffset) {
    res.scrollLeft = dom.scrollLeft
    res.scrollTop = dom.scrollTop
  }
  if (properties.length) {
    properties.forEach((prop) => {
      const kebabCaseProp = toKebabCase(prop)
      let attr = dom.getAttribute(prop) || dom.getAttribute(kebabCaseProp)
      if (!attr && (dom.hasAttribute(prop) || dom.hasAttribute(kebabCaseProp))) {
        attr = 'true'
      }
      if (attr) {
        res[prop] = attr === 'true' ? true : attr
      }
    })
  }
  if (computedStyle.length) {
    const styles = window.getComputedStyle(dom)
    computedStyle.forEach((key) => {
      const value = styles.getPropertyValue(key) || styles[key]
      if (value) res[key] = value
    })
  }

  return res
}

/**
 * WXML节点信息API
 * @return {Object} SelectorQuery 对象实例
 */
function queryBat (queue: ISelectorQueryQueue[], cb: (...args: any[]) => any): void {
  const result: any[] = []

  queue.forEach((item) => {
    const { selector, single, fields, component } = item
    // selector 的容器节点
    /* eslint-disable */
    const container: TElement = component !== null ? (findDOM(component) as HTMLElement) || document : document
    /* eslint-enable */

    // 特殊处理 ---- 选自己
    let selectSelf = false
    if (container !== document) {
      const $nodeList = container.parentNode?.querySelectorAll(selector)
      if ($nodeList) {
        for (let i = 0, len = $nodeList.length; i < len; ++i) {
          if (container === $nodeList[i]) {
            selectSelf = true
            break
          }
        }
      }
    }

    if (single) {
      const el = selectSelf === true ? container : container.querySelector(selector)
      result.push(filter(fields, el as HTMLElement, selector))
    } else {
      const $children = container.querySelectorAll(selector)
      const children: TElement[] = []
      selectSelf === true && children.push(container)
      for (let i = 0, len = $children.length; i < len; ++i) {
        children.push($children[i])
      }
      result.push(children.map((dom) => filter(fields, dom as HTMLElement)))
    }
  })
  cb(result)
}

/**
 * 查询节点信息
 * 
 * @canUse SelectorQuery
 * @__class [in, select, selectAll, selectViewport, exec]
 */
export class SelectorQuery implements Taro.SelectorQuery {
  _defaultWebviewId: string | null
  _webviewId: string | null
  _queue: ISelectorQueryQueue[]
  _queueCb: (TSelectorQueryQueueCallback | null)[]
  _component?: TaroGeneral.IAnyObject

  constructor () {
    this._defaultWebviewId = null
    this._webviewId = null
    this._queue = []
    this._queueCb = []
    this._component
  }

  in (component: TaroGeneral.IAnyObject) {
    this._component = component
    return this
  }

  select (selector: string) {
    // 小程序里跨自定义组件的后代选择器 '>>>' 在 h5 替换为普通后代选择器 '>'
    if (typeof selector === 'string') selector = selector.replace('>>>', '>')
    return new NodesRef(selector, this, true)
  }

  selectAll (selector: string) {
    // 小程序里跨自定义组件的后代选择器 '>>>' 在 h5 替换为普通后代选择器 '>'
    if (typeof selector === 'string') selector = selector.replace('>>>', '>')
    return new NodesRef(selector, this, false)
  }

  selectViewport () {
    return new NodesRef('.taro_page', this, true)
  }

  exec (cb) {
    queryBat(this._queue, (res) => {
      const _queueCb = this._queueCb
      res.forEach((item, index) => {
        const cb = _queueCb[index]
        isFunction(cb) && cb.call(this, item)
      })
      isFunction(cb) && cb.call(this, res)
    })
    return this as unknown as Taro.NodesRef
  }

  _push (selector: string, component, single, fields, callback: TSelectorQueryQueueCallback | null = null) {
    this._queue.push({
      component,
      selector,
      single,
      fields,
    })
    this._queueCb.push(callback)
  }
}
