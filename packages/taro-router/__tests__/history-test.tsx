import Taro from '@tarojs/taro-h5'

import { history } from '../src/history'
import { createRouter } from '../src/index'

beforeEach(() => {
  const inst = {}
  createRouter(inst, {
    entryPagePath: '/pages/index/index',
    router: {
      mode: 'browser',
      basename: '/',
      customRoutes: {
        '/index': '/pages/index/index',
        '/about': '/pages/about/about'
      },
      pathname: '/'
    },
    routes: [
      { path: 'pages/index/index', load: jest.fn() },
      { path: 'pages/about/about', load: jest.fn() },
    ]
  }, 'React')
})

describe.skip('navigateTo/navigateBack/redirectTo/reLaunch', () => {
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
    
    const spy = jest.spyOn(window.location, 'assign').mockImplementation(() => {})
    Taro.navigateTo({ url: thirdPartyWebsite })
    expect(spy).toHaveBeenCalledWith(thirdPartyWebsite)
    spy.mockClear()
  })

  it('should notify listeners with proper params when calling navigateTo', () => {
    const mockListener = jest.fn()
    history.listen(mockListener)

    Taro.navigateTo({ url: url2 })
    expect(mockListener).toHaveBeenCalledWith({ fromLocation: location1, toLocation: location2, action: 'PUSH' })
  })

  it('should notify listeners with proper params when calling navigateBack', () => {
    // jsdom无法准确模拟history的全部功能，这里使用spy代替
    const spy = jest.spyOn(window.history, 'go')
    Taro.navigateBack({ delta: 1 })
    expect(spy).toHaveBeenCalledWith(-1)
  })

  it('should notify listeners with proper params when calling redirectTo', () => {
    const mockListener = jest.fn()
    history.listen(mockListener)

    Taro.redirectTo({ url: url3 })
    expect(mockListener).toHaveBeenCalledWith({ fromLocation: location2, toLocation: location3, action: 'REPLACE' })
  })

  xit('should disable back button when calling reLaunch', () => {
    // Taro.navigateTo({ url: url2 })
    Taro.reLaunch({ url: url2 })
    expect(history.length).toBe(0)
  })
})
