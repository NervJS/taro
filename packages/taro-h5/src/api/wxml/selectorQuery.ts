import Taro from '@tarojs/api'
import { findDOM } from '../utils'
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

  const { id, dataset, rect, size, scrollOffset, properties = [], computedStyle = [] } = fields
  const { left, right, top, bottom, width, height } = dom.getBoundingClientRect()
  const isViewport = selector === '.taro_page'
  const res: any = {}

  if (id) res.id = dom.id
  if (dataset) res.dataset = Object.assign({}, dom.dataset)
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
  if (scrollOffset) {
    res.scrollLeft = dom.scrollLeft
    res.scrollTop = dom.scrollTop
  }
  if (properties.length) {
    properties.forEach(prop => {
      const attr = dom.getAttribute(prop)
      if (attr) res[prop] = attr
    })
  }
  if (computedStyle.length) {
    const styles = window.getComputedStyle(dom)
    computedStyle.forEach(key => {
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

  queue.forEach(item => {
    const { selector, single, fields, component } = item
    // selector 的容器节点
    /* eslint-disable */
    const container: TElement = (
      component !== null ?
        (findDOM(component) as HTMLElement || document) :
        document
    )
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
      result.push(children.map(dom => filter(fields, dom as HTMLElement)))
    }
  })
  cb(result)
}

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
    queryBat(this._queue, res => {
      const _queueCb = this._queueCb
      res.forEach((item, index) => {
        const cb = _queueCb[index]
        typeof cb === 'function' && cb.call(this, item)
      })
      typeof cb === 'function' && cb.call(this, res)
    })
    return this as unknown as Taro.NodesRef
  }

  _push (selector: string, component, single, fields, callback: TSelectorQueryQueueCallback | null = null) {
    this._queue.push({
      component,
      selector,
      single,
      fields
    })
    this._queueCb.push(callback)
  }
}
