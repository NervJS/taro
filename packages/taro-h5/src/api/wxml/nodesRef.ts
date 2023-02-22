/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
