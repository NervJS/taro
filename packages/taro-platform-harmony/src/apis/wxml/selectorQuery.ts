import { AREA_CHANGE_EVENT_NAME, Current, getPageScrollerOrNode, setNodeEventCallbackAndTriggerComponentUpdate } from '@tarojs/runtime'

import { NodesRef } from './nodesRef'

import type Taro from '@tarojs/taro/types'

interface ISelectorQueryQueue {
  component: any
  selector: string
  single: boolean
  fields
}

type TSelectorQueryQueueCallback = (res: ISelectorQueryQueue) => void

let arr: any = []

// 深度搜索 rootDom 下的所有节点，存放在 arr 中
function traversalDFSDom (rootDom) {
  if (!rootDom) return
  arr.push(rootDom)

  if (rootDom.childNodes.length === 0) return
  for (let i = 0; i < rootDom.childNodes.length; i++) {
    traversalDFSDom(rootDom.childNodes[i])
  }
}

// 从 arr 中寻找所有符合 selector 的节点
function parseHandler (selector, selectAll) {
  const domList: any = []
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
          if (arr[i].className?.includes(clsList[j])) {
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
    return [domList[0]]
  }
  return []
}

// 从 TaroNode 里找到对应的 fields 内容
function filter (fields, dom) {
  if (!dom) return null
  const {
    id,
    // dataset,
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

  // TODO harmony dataset
  // if (dataset) res.dataset = Object.assign({}, dom.dataset)

  if (rect || size) {
    const { areaInfo } = dom?._nodeInfo || {}

    if (areaInfo) {
      if (rect) {
        res.top = vp2px(areaInfo.globalPosition.y)
        res.left = vp2px(areaInfo.globalPosition.x)
        res.right = vp2px(areaInfo.globalPosition.x + areaInfo.width)
        res.bottom = vp2px(areaInfo.globalPosition.y + areaInfo.height)
      }

      if (size) {
        res.width = vp2px(areaInfo.width)
        res.height = vp2px(areaInfo.height)
      }
    }
  }
  if (scrollOffset) {
    const scroller = dom.scroller

    if (scroller) {
      const { xOffset, yOffset } = scroller.currentOffset()

      res.scrollLeft = vp2px(xOffset)
      res.scrollTop = vp2px(yOffset)
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

function querySelector (selector, selectAll) {
  if (typeof selector === 'string') {
    return selector.split(',').reduce((prev, current) => {
      const item = current.trim()

      return prev.concat(parseHandler(item, selectAll))
    }, [])
  }
  return []
}

function queryBat (queue, cb) {
  const result: any = []
  const taro = (Current as any).taro
  const page = taro.getCurrentInstance().page
  const element = getPageScrollerOrNode(page?.node, page)

  if (!element) return null

  arr = []
  traversalDFSDom(element)
  queue.forEach((item) => {
    const { selector, single, fields } = item

    if (single) {
      const dom = querySelector(selector, !single)[0]
      // eslint-disable-next-line no-async-promise-executor
      result.push(new Promise(async resolve => {
        await setNodeEventCallbackAndTriggerComponentUpdate(dom, AREA_CHANGE_EVENT_NAME, null, true)
        resolve(filter(fields, dom))
      }))
    } else {
      const nodeList = querySelector(selector, !single)
      result.push(nodeList.map(dom => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async resolve => {
          await setNodeEventCallbackAndTriggerComponentUpdate(dom, AREA_CHANGE_EVENT_NAME, null, true)

          resolve(filter(fields, dom))
        })
      }))
    }
  })

  Promise.all(result.map(item => {
    return item instanceof Array ? Promise.all(item) : item
  })).then(data => {
    cb(data)
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
  in = (_: any) => {
    this._component = null
    console.warn('暂不支持 in 操作')
    // this._component = component
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
