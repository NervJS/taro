import { SelectorQuery } from './selectorQuery'

import type Taro from '@tarojs/taro/types'

export class NodesRef implements Taro.NodesRef {
  _component?: any
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

  node (cb?: Taro.NodesRef.NodeCallback) {
    const { _selector, _component, _single, _selectorQuery } = this
    _selectorQuery._push(_selector, _component, _single, { nodeCanvasType: !0, node: !0 }, cb)
    return _selectorQuery
  }

  boundingClientRect (cb?: Taro.NodesRef.BoundingClientRectCallback) {
    const { _selector, _component, _single, _selectorQuery } = this
    _selectorQuery._push(_selector, _component, _single, { id: !0, dataset: !0, rect: !0, size: !0 }, cb)
    return _selectorQuery
  }

  scrollOffset (cb) {
    const { _selector, _component, _single, _selectorQuery } = this
    _selectorQuery._push(_selector, _component, _single, { id: !0, dataset: !0, scrollOffset: !0 }, cb)
    return _selectorQuery
  }

  fields (fields: Taro.NodesRef.Fields, cb?: Taro.NodesRef.FieldsCallback) {
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
