import Taro from '@tarojs/api'

import { current } from '../utils'
import { NodesRef } from './nodesRef.js'

interface ISelectorQueryQueue {
  component: TaroGeneral.IAnyObject
  selector: string
  single: boolean
  fields
}

type TSelectorQueryQueueCallback = (res: ISelectorQueryQueue) => void

let arr: any = []

function traversalDFSDom (rootDom) {
  if (!rootDom) return
  if (rootDom.children.length === 0) {
    arr.push(rootDom)
    return
  }
  arr.push(rootDom)
  for (let i = 0; i < rootDom.pureChildren.length; i++) {
    traversalDFSDom(rootDom.pureChildren[i])
  }
}

function parseHandler (element, selector, selectAll) {
  const domList:any = []
  arr = []
  traversalDFSDom(element)
  if (arr.length === 0) return null

  let selectedId, clsList
  switch (selector.charAt(0)) {
    case '#': // id selector
      selectedId = selector.substring(1)
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === selectedId) {
          domList.push(arr[i])
          if (!selectAll) {
            break
          }
        }
      }
      break
    case '.':
      clsList = selector.split('.').filter((item) => item !== '')
      if (clsList.length === 0) break

      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < clsList.length; j++) {
          if (arr[i].classList.indexOf(clsList[j]) > -1) {
            domList.push(arr[i])
            if (!selectAll) {
              break
            }
          }
        }
      }
      break
    default:
      console.warn('unSupport selector')
      break
  }
  if (selectAll) {
    return domList
  } else if (domList.length > 0) {
    return domList[0]
  }
  return null
}

function filter (fields, dom, selector) {
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
    context
  } = fields
  const res: any = {}

  if (nodeCanvasType && node) { // Node节点获取处理
    const typeName = dom.type
    res.node = {
      id: dom.id,
      $taroElement: dom
    }
    if (/^canvas/i.test(typeName)) {
      const canvasType = dom.attr.type || ''
      res.nodeCanvasType = canvasType
      if (/^(2d|webgl)/i.test(canvasType) && dom) {
        res.node = dom
      } else {
        res.node = null
      }
    } else {
      // TODO https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html
      // if (/^taro-scroll-view-core/i.test(tagName))
      res.nodeCanvasType = ''
      res.node = dom
    }
    return res
  }
  if (context) {
    const typeName = dom.type
    if (/^video/i.test(typeName)) {
      return { context: dom }
    } else if (/^canvas/i.test(typeName)) {
      const type = dom.type || '2d'
      const ctx = dom?.getContext(type)
      return { context: ctx }
    } else if (/^taro-live-player-core/i.test(typeName)) {
      console.error('暂时不支持通过 NodesRef.context 获取 LivePlayerContext')
    } else if (/^taro-editor-core/i.test(typeName)) {
      console.error('暂时不支持通过 NodesRef.context 获取 EditorContext')
    } else if (/^taro-map-core/i.test(typeName)) {
      console.error('暂时不支持通过 NodesRef.context 获取 MapContext')
    }
    return
  }
  if (id) res.id = dom.id
  if (dataset) res.dataset = Object.assign({}, dom.dataset)
  if (rect || size) {
    const { width, height, left, top } = dom.getBoundingClientRect()
    if (rect) {
      if (!isViewport) {
        res.left = left
        res.top = top
        res.right = left + width
        res.bottom = top + height
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
    const { x, y } = dom.getScrollOffset()
    res.scrollLeft = x
    res.scrollTop = y
  }
  if (properties.length) {
    properties.forEach(prop => {
      const attrs = dom.attr
      if (attrs[prop]) res[prop] = attrs[prop]
    })
  }
  if (computedStyle.length) {
    const styles = dom.classStyle
    computedStyle.forEach(key => {
      const value = styles[key]
      if (value) res[key] = value
    })
  }
  return res
}

function querySelector (selector, element, selectAll) {
  if (element == null) return null
  if (typeof selector === 'string') {
    return parseHandler(element, selector, selectAll)
  }
  return null
}

function queryBat (queue, cb) {
  const result: any = []
  const taro = current.taro
  const page = taro.getCurrentInstance().page
  queue.forEach(item => {
    const { selector, single, fields, component } = item
    const container = typeof (component) !== 'undefined' ? component : page.$rootElement()

    let selectSelf = false
    if (container !== page.$rootElement()) {
      const $nodeList = querySelector(selector, component.parentNode, true)
      if ($nodeList) {
        for (let i = 0, len = $nodeList.length; i < len; i++) {
          if (container === $nodeList[i]) {
            selectSelf = true
            break
          }
        }
      }
    }

    if (single) {
      const el = selectSelf ? container : querySelector(selector, container, false)
      result.push(filter(fields, el, selector))
    } else {
      const $children = querySelector(selector, container, true)
      const children: any = []
      selectSelf && children.push(container)
      for (let i = 0, len = $children.length; i < len; i++) {
        children.push($children[i])
      }
      result.push(children.map(dom => filter(fields, dom, selector)))
    }
  })
  cb(result)
}

export class SelectorQuery implements Taro.SelectorQuery {
  _queue: ISelectorQueryQueue[]
  _queueCb: (TSelectorQueryQueueCallback | null)[]
  _component?: TaroGeneral.IAnyObject

  constructor () {
    this._queue = []
    this._queueCb = []
    // this._component
  }

  /**
   * 设置选择器的选取范围
   * @param component 指定组件
   * @return selectQuery 返回查询对象
   */
  in (component: TaroGeneral.IAnyObject) {
    this._component = component
    return this
  }

  /**
   * 在当前页面下选择第一个匹配选择器selector的节点
   * @param selector
   * @return nodesRef 返回一个NodesRef 对象实例，可以用于获取节点信息
   */
  select (selector: string) {
    return new NodesRef(selector, this, true)
  }

  /**
   * 在当前页面下选择匹配选择器selector的所有节点
   * @param selector
   */
  selectAll (selector: string) {
    return new NodesRef(selector, this, false)
  }

  /**
   * 选择显示区域。可用于获取显示区域的尺寸、滚动位置等信息
   */
  selectViewport () {
    return new NodesRef('.taro_page', this, true)
  }

  exec (cb?: (...args: any[]) => any) {
    queryBat(this._queue, res => {
      const _queueCb = this._queueCb
      res.forEach((item, index) => {
        const cb = _queueCb[index]
        typeof cb === 'function' && cb.call(this, item)
      })
      typeof cb === 'function' && cb.call(this, res)
    })
    return this as any
  }

  _push (selector, component, single, fields, callback: Taro.NodesRef.FieldsCallback | null = null) {
    this._queue.push({
      component,
      selector,
      single,
      fields
    })
    this._queueCb.push(callback)
  }
}
