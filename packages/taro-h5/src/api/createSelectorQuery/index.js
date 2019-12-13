import Nerv from 'nervjs'

/**
 * WXML节点信息API
 * @return {Object} SelectorQuery 对象实例
 */
function queryBat (queue, cb) {
  const res = []

  queue.forEach(item => {
    const { selector, single, fields, component } = item
    // selector 的容器节点
    /* eslint-disable */
    const container = (
      component !== null ?
        (Nerv.findDOMNode(component) || document) :
        document
    )
    /* eslint-enable */

    // 特殊处理 ---- 选自己
    let selectSelf = false
    if (container !== document) {
      const $nodeList = container.parentNode.querySelectorAll(selector)
      for (let i = 0, len = $nodeList.length; i < len; ++i) {
        if (container === $nodeList[i]) {
          selectSelf = true
          break
        }
      }
    }

    if (single) {
      const el = selectSelf === true ? container : container.querySelector(selector)
      res.push(filter(fields, el, selector))
    } else {
      const $children = container.querySelectorAll(selector)
      const children = []
      selectSelf === true && children.push(container)
      for (let i = 0, len = $children.length; i < len; ++i) {
        children.push($children[i])
      }
      res.push(children.map(dom => filter(fields, dom)))
    }
  })
  cb(res)
}

function filter (fields, dom, selector) {
  if (!dom) return null

  const { id, dataset, rect, size, scrollOffset, properties = [], computedStyle = [] } = fields
  const { left, right, top, bottom, width, height } = dom.getBoundingClientRect()
  const isViewport = selector === 'html'
  const res = {}

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
    res.scrollHeight = dom.scrollHeight
    res.scrollWidth = dom.scrollWidth
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
      const value = styles.getPropertyValue(key)
      if (value) res[key] = value
    })
  }

  return res
}

class Query {
  constructor () {
    this._defaultWebviewId = null
    this._webviewId = null
    this._queue = []
    this._queueCb = []
    this._component = null
  }

  in (component) {
    this._component = component
    return this
  }

  select (selector) {
    // 小程序里跨自定义组件的后代选择器 '>>>' 在 h5 替换为普通后代选择器 '>'
    if (typeof selector === 'string') selector = selector.replace('>>>', '>')
    return new NodesRef(selector, this, true)
  }

  selectAll (selector) {
    // 小程序里跨自定义组件的后代选择器 '>>>' 在 h5 替换为普通后代选择器 '>'
    if (typeof selector === 'string') selector = selector.replace('>>>', '>')
    return new NodesRef(selector, this, false)
  }

  selectViewport () {
    return new NodesRef('html', this, true)
  }

  exec (cb) {
    queryBat(this._queue, res => {
      const _queueCb = this._queueCb
      res.forEach((item, index) => {
        typeof _queueCb[index] === 'function' && _queueCb[index].call(this, item)
      })
      typeof cb === 'function' && cb.call(this, res)
    })
  }

  _push (selector, component, single, fields, callback = null) {
    this._queue.push({
      component,
      selector,
      single,
      fields
    })
    this._queueCb.push(callback)
  }
}

class NodesRef {
  constructor (selector, querySelectorQuery, single) {
    this._component = querySelectorQuery._component
    this._selector = selector
    this._selectorQuery = querySelectorQuery
    this._single = single
  }

  boundingClientRect (cb) {
    const { _selector, _component, _single, _selectorQuery } = this
    _selectorQuery._push(_selector, _component, _single, { id: !0, dataset: !0, rect: !0, size: !0 }, cb)
    return _selectorQuery
  }

  scrollOffset (cb) {
    const { _selector, _component, _single, _selectorQuery } = this
    _selectorQuery._push(_selector, _component, _single, { id: !0, dataset: !0, scrollOffset: !0 }, cb)
    return _selectorQuery
  }

  fields (fields, cb) {
    const { _selector, _component, _single, _selectorQuery } = this
    const { id, dataset, rect, size, scrollOffset, properties = [], computedStyle = [] } = fields

    _selectorQuery._push(_selector, _component, _single, {
      id,
      dataset,
      rect,
      size,
      scrollOffset,
      properties,
      computedStyle
    }, cb)

    return _selectorQuery
  }
}

export function createSelectorQuery () {
  return new Query()
}
