import Taro from '@tarojs/api'

import { SelectorQuery } from './selectorQuery'

export class NodesRef implements Taro.NodesRef {
  _component?: TaroGeneral.IAnyObject
  _selector: string
  _selectorQuery: SelectorQuery
  _single: boolean

  constructor (selector: string, querySelectorQuery: SelectorQuery, single: boolean) {
    this._component = querySelectorQuery._component
    this._selector = selector
    this._selectorQuery = querySelectorQuery
    this._single = single
  }

  context (cb) {
    const { _selector, _component, _single, _selectorQuery } = this
    _selectorQuery._push(_selector, _component, _single, { context: !0 }, cb)
    return _selectorQuery
  }

  node (cb) {
    const { _selector, _component, _single, _selectorQuery } = this
    _selectorQuery._push(_selector, _component, _single, { nodeCanvasType: !0, node: !0 }, cb)
    return _selectorQuery
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
    const { id, dataset, rect, size, scrollOffset, context, node, properties = [], computedStyle = [] } = fields

    _selectorQuery._push(
      _selector,
      _component,
      _single,
      {
        id,
        dataset,
        rect,
        size,
        scrollOffset,
        context,
        node,
        nodeCanvasType: node,
        properties,
        computedStyle,
      },
      cb
    )

    return _selectorQuery
  }
}
