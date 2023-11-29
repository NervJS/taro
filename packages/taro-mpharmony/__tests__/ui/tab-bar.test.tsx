import * as Taro from '@tarojs/taro-h5'

import { buildApp } from '../utils'

describe('tabbar', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    buildApp()
  })

  it('should be able to set/removeTabBarBadge', done => {
    // @ts-ignore
    Taro.eventCenter.once('__taroSetTabBarBadge', res => res.successHandler({
      errMsg: 'setTabBarBadge:ok'
    }))
    // @ts-ignore
    Taro.eventCenter.once('__taroRemoveTabBarBadge', res => res.successHandler({
      errMsg: 'removeTabBarBadge:ok'
    }))
    Taro.setTabBarBadge({
      index: 0,
      text: 'text'
    }).then(res => {
      expect(res.errMsg).toBe('setTabBarBadge:ok')
      // let badges = div.querySelector('.taro-tabbar-badge')
      // expect(badges).toBeTruthy()
      // expect(badges.innerHTML).toBe('text')

      Taro.removeTabBarBadge({
        index: 0
      }).then(res => {
        expect(res.errMsg).toBe('removeTabBarBadge:ok')
        // badges = div.querySelector('.taro-tabbar-badge')
        // expect(badges).toBeFalsy()
        done()
      })
    })
  })

  it('should be able to show/hideTabBarRedDot', done => {
    // @ts-ignore
    Taro.eventCenter.once('__taroShowTabBarRedDotHandler', res => res.successHandler({
      errMsg: 'showTabBarRedDot:ok'
    }))
    // @ts-ignore
    Taro.eventCenter.once('__taroHideTabBarRedDotHandler', res => res.successHandler({
      errMsg: 'hideTabBarRedDot:ok'
    }))
    Taro.showTabBarRedDot({
      index: 0
    }).then(res => {
      expect(res.errMsg).toBe('showTabBarRedDot:ok')
      // let badges = div.querySelector('.weui-badge_dot')
      // expect(badges).toBeTruthy()

      Taro.hideTabBarRedDot({
        index: 0
      }).then(res => {
        expect(res.errMsg).toBe('hideTabBarRedDot:ok')
        // badges = div.querySelector('.weui-badge_dot')
        // expect(badges).toBeFalsy()
        done()
      })
    })
  })

  it('should be able to show/hideTabBar', done => {
    // @ts-ignore
    Taro.eventCenter.once('__taroHideTabBar', res => res.successHandler({
      errMsg: 'hideTabBar:ok'
    }))
    // @ts-ignore
    Taro.eventCenter.once('__taroShowTabBar', res => res.successHandler({
      errMsg: 'showTabBar:ok'
    }))
    Taro.hideTabBar().then(res => {
      expect(res.errMsg).toBe('hideTabBar:ok')
      // let badges = div.querySelector('.taro-tabbar__tabbar-hide')
      // expect(badges).toBeTruthy()

      Taro.showTabBar().then(res => {
        expect(res.errMsg).toBe('showTabBar:ok')
        // badges = div.querySelector('.taro-tabbar__tabbar-hide')
        // expect(badges).toBeFalsy()
        done()
      })
    })
  })

  it('should be able to setTabBarStyle', done => {
    // @ts-ignore
    Taro.eventCenter.once('__taroSetTabBarStyle', res => res.successHandler({
      errMsg: 'setTabBarStyle:ok'
    }))
    Taro.setTabBarStyle({
      backgroundColor: '#bbbbbb',
      borderStyle: 'black',
      color: '#cccccc'
    }).then(res => {
      expect(res.errMsg).toBe('setTabBarStyle:ok')
      done()
    })
  })

  it('should be able to setTabBarItem', done => {
    // @ts-ignore
    Taro.eventCenter.once('__taroSetTabBarItem', res => res.successHandler({
      errMsg: 'setTabBarItem:ok'
    }))
    Taro.setTabBarItem({
      index: 0,
      iconPath: 'iconPath',
      selectedIconPath: 'selectedIconPath',
      text: 'text'
    }).then(res => {
      expect(res.errMsg).toBe('setTabBarItem:ok')
      done()
    })
  })

  it('should be able to switchTab', done => {
    Taro.switchTab({
      url: '/pages/about/index'
    }).then((res: any) => {
      expect(res.errMsg).toBe('switchTab:ok')
      done()
    })
  })
})
