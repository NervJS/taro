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

import mountApis from '../apis'
import createHistory from '../history/createHistory'
import Taro from '@tarojs/taro-h5'
import { History } from '../utils/types'

let history: History
let navigateTo
let navigateBack
let redirectTo
let reLaunch

beforeEach(() => {
  history = createHistory({
    mode: 'browser',
    basename: '/',
    firstPagePath: '/pages/index/index',
    customRoutes: {
      '/index': '/pages/index/index',
      '/about': '/pages/about/about'
    }
  })
  mountApis({ customRoutes: {}, basename: '', currentPagename: 'pages/index/index' }, history)
  navigateTo = Taro.navigateTo
  navigateBack = Taro.navigateBack
  redirectTo = Taro.redirectTo
  reLaunch = Taro.reLaunch
})

describe('navigateTo/navigateBack/redirectTo/reLaunch', () => {
  const location1 = {
    path: '/pages/index/index',
    state: { key: '0' },
    search: '',
    hash: '',
    params: {}
  }

  const url2 = '/pages/about/index?para=1'
  const location2 = {
    path: '/pages/about/index',
    state: { key: '1' },
    search: '?para=1',
    hash: '',
    params: {
      para: '1'
    }
  }

  const url3 = '/pages/settings/index?para2=2'
  const location3 = {
    path: '/pages/settings/index',
    state: { key: '1' },
    search: '?para2=2',
    hash: '',
    params: {
      para2: '2'
    }
  }

  it('should be able to navigate to third-party websites', () => {
    const thirdPartyWebsite = 'https://www.baidu.com'
    const navigateTo = Taro.navigateTo
    
    const spy = jest.spyOn(window.location, 'assign').mockImplementation(() => {})
    navigateTo({ url: thirdPartyWebsite })
    expect(spy).toHaveBeenCalledWith(thirdPartyWebsite)
    spy.mockClear()
  })

  it('should notify listeners with proper params when calling navigateTo', () => {
    const mockListener = jest.fn()
    history.listen(mockListener)

    navigateTo({ url: url2 })
    expect(mockListener).toHaveBeenCalledWith({ fromLocation: location1, toLocation: location2, action: 'PUSH' })
  })

  it('should notify listeners with proper params when calling navigateBack', () => {
    // jsdom无法准确模拟history的全部功能，这里使用spy代替
    const spy = spyOn(window.history, 'go')
    navigateBack({ delta: 1 })
    expect(spy).toHaveBeenCalledWith(-1)
  })

  it('should notify listeners with proper params when calling redirectTo', () => {
    const mockListener = jest.fn()
    history.listen(mockListener)

    redirectTo({ url: url3 })
    expect(mockListener).toHaveBeenCalledWith({ fromLocation: location2, toLocation: location3, action: 'REPLACE' })
  })

  xit('should disable back button when calling reLaunch', () => {
    // navigateTo({ url: url2 })
    reLaunch({ url: url2 })
    expect(history.length).toBe(0)
  })
})
