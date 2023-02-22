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

import '@testing-library/jest-dom/extend-expect'

import * as Taro from '@tarojs/taro-h5'

describe('actionSheet', () => {
  test('options.itemList should be Array', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    Taro.showActionSheet({
      itemList: 'abc',
      success,
      fail,
      complete
    })
    const expectErrObj = { errMsg: 'showActionSheet:fail parameter error: parameter.itemList should be Array instead of String' }
    expect(success.mock.calls.length).toBe(0)
    expect(fail).toHaveBeenCalledWith(expectErrObj)
    expect(complete).toHaveBeenCalledWith(expectErrObj)
  })

  test('options.itemList should have at least 1 item', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    Taro.showActionSheet({
      itemList: [],
      success,
      fail,
      complete
    })
    const expectErrObj = { errMsg: 'showActionSheet:fail parameter error: parameter.itemList should have at least 1 item' }
    expect(success.mock.calls.length).toBe(0)
    expect(fail).toHaveBeenCalledWith(expectErrObj)
    expect(complete).toHaveBeenCalledWith(expectErrObj)
  })

  test('options.itemList should not be large than 6', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    Taro.showActionSheet({
      itemList: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      success,
      fail,
      complete
    })
    const expectErrObj = { errMsg: 'showActionSheet:fail parameter error: parameter.itemList should not be large than 6' }
    expect(success.mock.calls.length).toBe(0)
    expect(fail).toHaveBeenCalledWith(expectErrObj)
    expect(complete).toHaveBeenCalledWith(expectErrObj)
  })

  test('options.itemList should not be large than 6', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    Taro.showActionSheet({
      itemList: ['a', 1, 'c'],
      success,
      fail,
      complete
    })
    const expectErrObj = { errMsg: 'showActionSheet:fail parameter error: parameter.itemList[1] should be String instead of Number' }
    expect(success.mock.calls.length).toBe(0)
    expect(fail).toHaveBeenCalledWith(expectErrObj)
    expect(complete).toHaveBeenCalledWith(expectErrObj)
  })

  test('options.itemColor should be String', () => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    Taro.showActionSheet({
      itemList: ['a'],
      itemColor: 123,
      success,
      fail,
      complete
    })
    const expectErrObj = { errMsg: 'showActionSheet:fail parameter error: parameter.itemColor should be String instead of Number' }
    expect(success.mock.calls.length).toBe(0)
    expect(fail).toHaveBeenCalledWith(expectErrObj)
    expect(complete).toHaveBeenCalledWith(expectErrObj)
  })

  test('basic test', done => {
    const itemA = 'A'
    const itemB = 'B'
    const itemC = 'C'
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    Taro.showActionSheet({
      itemList: [itemA, itemB, itemC],
      success,
      fail,
      complete
    })
      .then(res => {
        const expectObj = { errMsg: 'showActionSheet:ok', tapIndex: 1 }
        expect(success).toHaveBeenCalledWith(expectObj)
        expect(fail.mock.calls.length).toBe(0)
        expect(complete).toHaveBeenCalledWith(expectObj)
        expect(res).toEqual(expectObj)
        done()
      })

    const actionSheet: any = document.body.lastChild
    expect(actionSheet.childNodes.length).toBe(2)

    const mask = actionSheet.firstChild
    const list = actionSheet.lastChild.firstChild

    expect(list.childNodes.length).toBe(3)
    expect(list.childNodes[0]).toHaveTextContent(itemA)
    expect(list.childNodes[1]).toHaveTextContent(itemB)
    expect(list.childNodes[2]).toHaveTextContent(itemC)

    setTimeout(() => {
      expect(actionSheet).toBeVisible()
      expect(mask).toBeVisible()
      list.childNodes[1].click()
    }, 200)
  })

  test('should hide actionSheet when cancel was clicked', done => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    Taro.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success,
      fail,
      complete
    })

    const actionSheet: any = document.body.lastChild
    const cancel = actionSheet.lastChild.lastChild

    cancel.click()
    setTimeout(() => {
      const expectObj = { errMsg: 'showActionSheet:fail cancel' }
      expect(actionSheet).not.toBeVisible()
      expect(success.mock.calls.length).toBe(0)
      expect(fail).toHaveBeenCalledWith(expectObj)
      expect(complete).toHaveBeenCalledWith(expectObj)
      done()
    }, 200)
  })

  test('should hide actionSheet when mask was clicked', done => {
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    Taro.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success,
      fail,
      complete
    })
    const actionSheet: any = document.body.lastChild
    const mask = actionSheet.firstChild

    mask.click()
    setTimeout(() => {
      const expectObj = { errMsg: 'showActionSheet:fail cancel' }
      expect(actionSheet).not.toBeVisible()
      expect(success.mock.calls.length).toBe(0)
      expect(fail).toHaveBeenCalledWith(expectObj)
      expect(complete).toHaveBeenCalledWith(expectObj)
      done()
    }, 200)
  })

  test('should set itemColor successful', () => {
    Taro.showActionSheet({
      itemList: ['A', 'B', 'C'],
      itemColor: 'red'
    })

    const actionSheet: any = document.body.lastChild
    const list = actionSheet.lastChild.firstChild

    expect(list).toHaveStyle({ color: 'red' })
  })

  test('should update list item when only item content changed', () => {
    const itemA = 'A'
    const itemB = 'E'
    const itemC = 'P'
    Taro.showActionSheet({
      itemList: [itemA, itemB, itemC]
    })

    const actionSheet: any = document.body.lastChild
    const list = actionSheet.lastChild.firstChild

    expect(list.childNodes.length).toBe(3)
    expect(list.childNodes[0]).toHaveTextContent(itemA)
    expect(list.childNodes[1]).toHaveTextContent(itemB)
    expect(list.childNodes[2]).toHaveTextContent(itemC)
  })

  test('should update list item when itemList get longer', () => {
    const itemA = 'A'
    const itemB = 'E'
    const itemC = 'P'
    const itemD = 'M'
    const itemE = 'N'
    Taro.showActionSheet({
      itemList: [itemA, itemB, itemC, itemD, itemE]
    })

    const actionSheet: any = document.body.lastChild
    const list = actionSheet.lastChild.firstChild

    expect(list.childNodes.length).toBe(5)
    expect(list.childNodes[0]).toHaveTextContent(itemA)
    expect(list.childNodes[1]).toHaveTextContent(itemB)
    expect(list.childNodes[2]).toHaveTextContent(itemC)
    expect(list.childNodes[3]).toHaveTextContent(itemD)
    expect(list.childNodes[4]).toHaveTextContent(itemE)
  })

  test('should update list item when only itemList get shorter', () => {
    const itemA = 'U'
    const itemB = 'I'
    Taro.showActionSheet({
      itemList: [itemA, itemB]
    })

    const actionSheet: any = document.body.lastChild
    const list = actionSheet.lastChild.firstChild

    expect(list.childNodes.length).toBe(2)
    expect(list.childNodes[0]).toHaveTextContent(itemA)
    expect(list.childNodes[1]).toHaveTextContent(itemB)
  })
})
