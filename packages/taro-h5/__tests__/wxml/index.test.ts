/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import { Current } from '@tarojs/runtime'
import * as Taro from '@tarojs/taro-h5'

import { findDOM } from '../../src/utils'
import { buildApp } from '../utils'

let pageDOM: any

describe('selectorQuery', () => {
  beforeAll(() => {
    // @ts-ignore
    window.HTMLElement.prototype.getBoundingClientRect = () => ({
      left: 50,
      right: 150,
      top: 100,
      bottom: 200,
      width: 100,
      height: 100
    })
  })

  beforeEach(() => {
    jest.resetAllMocks()
    buildApp()
    Current.page = {
      path: '/pages/index/index?stamp=0'
    }
    document.body.innerHTML = `<div id="app"><div id="${Current.page?.path}" class="taro_page" /></div>`
    pageDOM = findDOM() || document.body
  })

  test('should get single element\'s boundingClientRect', done => {
    pageDOM.innerHTML = '<div id="box__a" data-url="xxx">box1</div>'
    const query = Taro.createSelectorQuery()
    query.select('#box__a').boundingClientRect(rect => {
      expect(rect).toEqual({
        id: 'box__a',
        dataset: {
          url: 'xxx'
        },
        left: 50,
        right: 150,
        top: 100,
        bottom: 200,
        width: 100,
        height: 100
      })
      done()
    }).exec()
  })

  test('should get multi elements\'s boundingClientRect', done => {
    pageDOM.innerHTML = `
      <div id="box__a" class="box" data-url="xyz">box1</div>
      <div id="box__b" class="box" data-url="xxx" data-key="uzi">box1</div>
    `
    const query = Taro.createSelectorQuery()
    query.selectAll('.box').boundingClientRect(rect => {
      expect(rect).toEqual([{
        id: 'box__a',
        dataset: {
          url: 'xyz'
        },
        left: 50,
        right: 150,
        top: 100,
        bottom: 200,
        width: 100,
        height: 100
      }, {
        id: 'box__b',
        dataset: {
          url: 'xxx',
          key: 'uzi'
        },
        left: 50,
        right: 150,
        top: 100,
        bottom: 200,
        width: 100,
        height: 100
      }])
      done()
    }).exec()
  })

  test('should get viewport\'s boundingClientRect', done => {
    const viewport = document.querySelector('.taro_page')
    const clientWidth = 375
    const clientHeight = 690
    Object.defineProperties(viewport, {
      clientWidth: { value: clientWidth },
      clientHeight: { value: clientHeight }
    })

    const query = Taro.createSelectorQuery()
    query.selectViewport().boundingClientRect(rect => {
      expect(rect).toEqual({
        id: Current.page?.path,
        dataset: {},
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: clientWidth,
        height: clientHeight
      })
      done()
    }).exec()
  })

  test('should get scrollOffset', done => {
    pageDOM.innerHTML = '<div class="box" >box1</div>'
    const box: any = document.querySelector('.box')
    const scrollLeft = 188
    const scrollTop = 233
    box.scrollLeft = scrollLeft
    box.scrollTop = scrollTop
    const query = Taro.createSelectorQuery()
    query.select('.box').scrollOffset(res => {
      expect(res).toEqual({
        id: '',
        dataset: {},
        scrollLeft,
        scrollTop
      })
      done()
    }).exec()
  })

  test('should get dom detail from field', done => {
    pageDOM.innerHTML = '<div id="box__a" data-url="xxx" scroll-x="50" upper-threshold="77">box1</div>'
    const query = Taro.createSelectorQuery()
    query.select('#box__a').fields({
      rect: true,
      size: true,
      scrollOffset: true,
      properties: ['scroll-x', 'threshold'],
      computedStyle: ['display']
    }, rect => {
      expect(rect).toEqual({
        left: 50,
        right: 150,
        top: 100,
        bottom: 200,
        width: 100,
        height: 100,
        scrollLeft: 0,
        scrollTop: 0,
        'scroll-x': '50',
        display: 'block'
      })
      done()
    }).exec()
  })

  test('should exec all', done => {
    pageDOM.innerHTML = `
      <div id="box__a" class="box" data-url="xyz">box1</div>
      <div id="box__b" class="box" data-url="xxx" data-key="uzi">box1</div>
    `
    const query = Taro.createSelectorQuery()
    query.select('#box__a').boundingClientRect()
    query.select('#box__b').boundingClientRect()
    query.exec(res => {
      expect(res).toEqual([{
        id: 'box__a',
        dataset: {
          url: 'xyz'
        },
        left: 50,
        right: 150,
        top: 100,
        bottom: 200,
        width: 100,
        height: 100
      }, {
        id: 'box__b',
        dataset: {
          url: 'xxx',
          key: 'uzi'
        },
        left: 50,
        right: 150,
        top: 100,
        bottom: 200,
        width: 100,
        height: 100
      }])
      done()
    })
  })
})
