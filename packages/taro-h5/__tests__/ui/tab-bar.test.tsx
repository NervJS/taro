import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as Taro from '../../src/index'
import { buildApp } from '../utils'

describe('tabbar', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    buildApp()
  })

  it('should be able to set/removeTabBarBadge', async () => {
    // @ts-ignore
    Taro.eventCenter.once('__taroSetTabBarBadge', res => res.successHandler({
      errMsg: 'setTabBarBadge:ok'
    }))
    // @ts-ignore
    Taro.eventCenter.once('__taroRemoveTabBarBadge', res => res.successHandler({
      errMsg: 'removeTabBarBadge:ok'
    }))
    const res = await Taro.setTabBarBadge({
      index: 0,
      text: 'text'
    })
    expect(res.errMsg).toBe('setTabBarBadge:ok')
    // let badges = div.querySelector('.taro-tabbar-badge')
    // expect(badges).toBeTruthy()
    // expect(badges.innerHTML).toBe('text')

    const res2 = await Taro.removeTabBarBadge({
      index: 0
    })
    expect(res2.errMsg).toBe('removeTabBarBadge:ok')
    // badges = div.querySelector('.taro-tabbar-badge')
    // expect(badges).toBeFalsy()
  })

  it('should be able to show/hideTabBarRedDot', async () => {
    // @ts-ignore
    Taro.eventCenter.once('__taroShowTabBarRedDotHandler', res => res.successHandler({
      errMsg: 'showTabBarRedDot:ok'
    }))
    // @ts-ignore
    Taro.eventCenter.once('__taroHideTabBarRedDotHandler', res => res.successHandler({
      errMsg: 'hideTabBarRedDot:ok'
    }))
    const res = await Taro.showTabBarRedDot({
      index: 0
    })
    expect(res.errMsg).toBe('showTabBarRedDot:ok')
    // let badges = div.querySelector('.weui-badge_dot')
    // expect(badges).toBeTruthy()

    const res2 = await Taro.hideTabBarRedDot({
      index: 0
    })
    expect(res2.errMsg).toBe('hideTabBarRedDot:ok')
    // badges = div.querySelector('.weui-badge_dot')
    // expect(badges).toBeFalsy()
  })

  it('should be able to show/hideTabBar', async () => {
    // @ts-ignore
    Taro.eventCenter.once('__taroHideTabBar', res => res.successHandler({
      errMsg: 'hideTabBar:ok'
    }))
    // @ts-ignore
    Taro.eventCenter.once('__taroShowTabBar', res => res.successHandler({
      errMsg: 'showTabBar:ok'
    }))
    const res = await Taro.hideTabBar()
    expect(res.errMsg).toBe('hideTabBar:ok')
    // let badges = div.querySelector('.taro-tabbar__tabbar-hide')
    // expect(badges).toBeTruthy()

    const res2 = await Taro.showTabBar()
    expect(res2.errMsg).toBe('showTabBar:ok')
    // badges = div.querySelector('.taro-tabbar__tabbar-hide')
    // expect(badges).toBeFalsy()
  })

  it('should be able to setTabBarStyle', async () => {
    // @ts-ignore
    Taro.eventCenter.once('__taroSetTabBarStyle', res => res.successHandler({
      errMsg: 'setTabBarStyle:ok'
    }))
    const res = await Taro.setTabBarStyle({
      backgroundColor: '#bbbbbb',
      borderStyle: 'black',
      color: '#cccccc'
    })
    expect(res.errMsg).toBe('setTabBarStyle:ok')
  })

  it('should be able to setTabBarItem', async () => {
    // @ts-ignore
    Taro.eventCenter.once('__taroSetTabBarItem', res => res.successHandler({
      errMsg: 'setTabBarItem:ok'
    }))
    const res = await Taro.setTabBarItem({
      index: 0,
      iconPath: 'iconPath',
      selectedIconPath: 'selectedIconPath',
      text: 'text'
    })
    expect(res.errMsg).toBe('setTabBarItem:ok')
  })

  it('should be able to switchTab', async () => {
    const res: any = await Taro.switchTab({
      url: '/pages/about/index'
    })
    expect(res.errMsg).toBe('switchTab:ok')
  })
})
