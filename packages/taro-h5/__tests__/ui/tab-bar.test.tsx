import { createReactApp } from '@tarojs/runtime'
import { createRouter } from '@tarojs/router'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  hideTabBar,
  hideTabBarRedDot,
  removeTabBarBadge,
  setTabBarBadge,
  setTabBarItem,
  setTabBarStyle,
  showTabBar,
  showTabBarRedDot
} from '../../src/api'
import Taro from '../../src/taro'

const appConfig: any = {
  pages: [
    'pages/index/index',
    'pages/about/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#333',
    selectedColor: '#409EFF',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [{
      pagePath: '/pages/index/index', text: '首页'
    }, {
      pagePath: '/pages/about/about', text: '关于我们'
    }],
    mode: 'hash',
    basename: '/test/app',
    customRoutes: {
      '/pages/about/index': '/about'
    }
  },
  router: { mode: 'hash' }
}

describe('tabbar', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    const config: any = { ...appConfig }
    class App extends React.Component {
      render () {
        return this.props.children
      }
    }
    config.routes = config.pages?.map(path => ({ path, load: () => null }));
    const inst = createReactApp(App, React, ReactDOM, config)
    createRouter(inst, config, 'React')
  })
  it('should be able to set/removeTabBarBadge', done => {
    Taro.eventCenter.once('__taroSetTabBarBadge', res => res.successHandler({
      errMsg: 'setTabBarBadge:ok'
    }), null)
    Taro.eventCenter.once('__taroRemoveTabBarBadge', res => res.successHandler({
      errMsg: 'removeTabBarBadge:ok'
    }), null)
    setTabBarBadge({
      index: 0,
      text: 'text'
    }).then(res => {
      expect(res.errMsg).toBe('setTabBarBadge:ok')
      // let badges = div.querySelector('.taro-tabbar-badge')
      // expect(badges).toBeTruthy()
      // expect(badges.innerHTML).toBe('text')

      removeTabBarBadge({
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
    Taro.eventCenter.once('__taroShowTabBarRedDotHandler', res => res.successHandler({
      errMsg: 'showTabBarRedDot:ok'
    }), null)
    Taro.eventCenter.once('__taroHideTabBarRedDotHandler', res => res.successHandler({
      errMsg: 'hideTabBarRedDot:ok'
    }), null)
    showTabBarRedDot({
      index: 0
    }).then(res => {
      expect(res.errMsg).toBe('showTabBarRedDot:ok')
      // let badges = div.querySelector('.weui-badge_dot')
      // expect(badges).toBeTruthy()

      hideTabBarRedDot({
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
    Taro.eventCenter.once('__taroHideTabBar', res => res.successHandler({
      errMsg: 'hideTabBar:ok'
    }), null)
    Taro.eventCenter.once('__taroShowTabBar', res => res.successHandler({
      errMsg: 'showTabBar:ok'
    }), null)
    hideTabBar().then(res => {
      expect(res.errMsg).toBe('hideTabBar:ok')
      // let badges = div.querySelector('.taro-tabbar__tabbar-hide')
      // expect(badges).toBeTruthy()

      showTabBar().then(res => {
        expect(res.errMsg).toBe('showTabBar:ok')
        // badges = div.querySelector('.taro-tabbar__tabbar-hide')
        // expect(badges).toBeFalsy()
        done()
      })
    })
  })
  it('should be able to setTabBarStyle', done => {
    Taro.eventCenter.once('__taroSetTabBarStyle', res => res.successHandler({
      errMsg: 'setTabBarStyle:ok'
    }), null)
    setTabBarStyle({
      backgroundColor: '#bbbbbb',
      borderStyle: 'black',
      color: '#cccccc'
    }).then(res => {
      expect(res.errMsg).toBe('setTabBarStyle:ok')
      done()
    })
  })
  it('should be able to setTabBarItem', done => {
    Taro.eventCenter.once('__taroSetTabBarItem', res => res.successHandler({
      errMsg: 'setTabBarItem:ok'
    }), null)
    setTabBarItem({
      index: 0,
      iconPath: 'iconPath',
      selectedIconPath: 'selectedIconPath',
      text: 'text'
    }).then(res => {
      expect(res.errMsg).toBe('setTabBarItem:ok')
      done()
    })
  })
  // it('should be able to switchTab', done => {
  //   switchTab({
  //     url: '/pages/about/about'
  //   }).then((res: any) => {
  //     expect(res.errMsg).toBe('switchTab:ok')
  //     done()
  //   })
  // })
})
