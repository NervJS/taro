import { Current, getPageScrollerOrNode } from '@tarojs/runtime'

import { NodesRef } from './nodesRef'

import type { TaroAny } from '@tarojs/runtime'
import type Taro from '@tarojs/taro/types'

interface ISelectorQueryQueue {
  component: any
  selector: string
  single: boolean
  fields
}

type TSelectorQueryQueueCallback = (res: ISelectorQueryQueue) => void

// 从 TaroNode 里找到对应的 fields 内容
function filter (fields, dom) {
  if (!dom) return null
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
  if (node) {
    if (nodeCanvasType) { // Node节点获取处理
      const typeName = dom.nodeName
      res.node = {
        id: dom.id,
        $taroElement: dom
      }
      if (/^canvas/i.test(typeName)) {
        // harmony todo canvas attr type
        const canvasType = dom._attrs.type || ''
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
    } else {
      res.node = dom
    }
  }
  if (context) {
    // TODO: 暂未实现获取  context
    // const typeName = dom.type
    // if (/^video/i.test(typeName)) {
    //   return { context: dom }
    // } else if (/^canvas/i.test(typeName)) {
    //   const type = dom.type || '2d'
    //   // harmony todo canvas context
    //   const ctx = dom?.getContext(type)
    //   return { context: ctx }
    // } else if (/^taro-live-player-core/i.test(typeName)) {
    //   console.error('暂时不支持通过 NodesRef.context 获取 LivePlayerContext')
    // } else if (/^taro-editor-core/i.test(typeName)) {
    //   console.error('暂时不支持通过 NodesRef.context 获取 EditorContext')
    // } else if (/^taro-map-core/i.test(typeName)) {
    //   console.error('暂时不支持通过 NodesRef.context 获取 MapContext')
    // }
  }
  if (id) res.id = dom.id

  if (dataset) res.dataset = Object.assign({}, dom.dataset)

  if (rect || size) {
    const computedStyle = dom.getComputedStyle()
    if (rect) {
      res.top = computedStyle.globalY
      res.left = computedStyle.globalX
      res.right = res.left + computedStyle.width
      res.bottom = res.top + computedStyle.height
    }

    if (size) {
      res.width = computedStyle.width
      res.height = computedStyle.height
    }
  }
  if (scrollOffset) {
    // FIXME 更新为新的获取方式获取组件参数
    const result = Current.nativeModule.getCurrentOffset(dom)

    if (result) {
      const { xOffset, yOffset } = result

      res.scrollLeft = xOffset
      res.scrollTop = yOffset
    }
  }
  if (properties.length) {
    properties.forEach(prop => {
      const attrs = dom._attrs
      if (attrs[prop]) res[prop] = attrs[prop]
    })
  }
  if (computedStyle.length) {
    const styles = dom._st
    computedStyle.forEach(key => {
      const value = styles[key]
      if (value) res[key] = value
    })
  }
  return res
}

function queryBat(queue, cb) {
  const result: TaroAny = []
  const taro = Current.taro
  const page = taro.getCurrentInstance().page
  const element = getPageScrollerOrNode(page?.node, page)

  if (!element) return null

  const actions = queue.map((item) => {
    const { component, selector, single, fields } = item
    return new Promise<void>(resolve => {
      Current.nativeModule.querySelectDOM(component || page.node, selector, !single, (res) => {
        if (res && res.length > 0) {
          if (single) {
            const dom = res[0]
            result.push(filter(fields, dom))
          } else {
            result.push(res.map(dom => {
              return filter(fields, dom)
            }))
          }
        }
        resolve()
      })
    })
  })

  Promise.all(actions).then(() => {
    cb(result)
  })
}

export class SelectorQuery implements Taro.SelectorQuery {
  _queue: ISelectorQueryQueue[]
  _queueCb: (TSelectorQueryQueueCallback | null)[]
  _component?: any

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
  in = (component: any) => {
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
