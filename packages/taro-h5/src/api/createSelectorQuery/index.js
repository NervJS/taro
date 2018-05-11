/**
 * WXML节点信息API
 * @return {Object} SelectorQuery 对象实例
 */
function queryBat (queue, cb) {
  const res = []

  queue.forEach(item => {
    const { selector, single, fields } = item
    let el = null

    if (single) {
      el = document.querySelector(selector)
      res.push(filter(fields, el, selector))
    } else {
      el = Array.from(document.querySelectorAll(selector))
      res.push(el.map(dom => filter(fields, dom)))
    }
  })
  cb(res)
}

function filter (fields, dom, selector) {
  if (!dom) return null

  const { id, dataset, rect, size, scrollOffset, properties = [] } = fields
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
      res.left = res.right = res.top = res.bottom = 0
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
      res[prop] = dom.getAttribute(prop)
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
    selector = selector.replace('>>>', '>')
    return new NodesRef(selector, this, true)
  }

  selectAll (selector) {
    // 小程序里跨自定义组件的后代选择器 '>>>' 在 h5 替换为普通后代选择器 '>'
    selector = selector.replace('>>>', '>')
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
    _selectorQuery._push(_selector, _component, _single, {id: !0, dataset: !0, rect: !0, size: !0}, cb)
    return _selectorQuery
  }

  scrollOffset (cb) {
    const { _selector, _component, _single, _selectorQuery } = this
    _selectorQuery._push(_selector, _component, _single, {id: !0, dataset: !0, scrollOffset: !0}, cb)
    return _selectorQuery
  }

  fields (fields, cb) {
    const { _selector, _component, _single, _selectorQuery } = this
    const { id, dataset, rect, size, scrollOffset, properties = [] } = fields

    _selectorQuery._push(_selector, _component, _single, {
      id,
      dataset,
      rect,
      size,
      scrollOffset,
      properties
    }, cb)

    return _selectorQuery
  }
}

export function createSelectorQuery () {
  return new Query()
}
