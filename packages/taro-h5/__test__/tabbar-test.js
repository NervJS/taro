/*
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

/* eslint-disable react/react-in-jsx-scope */
import Nerv from 'nervjs'
import {
  hideTabBar,
  hideTabBarRedDot,
  initTabBarApis,
  removeTabBarBadge,
  setTabBarBadge,
  setTabBarItem,
  setTabBarStyle,
  showTabBar,
  showTabBarRedDot,
  switchTab
} from '../src/api/tabBar'
import Tabbar from '@tarojs/components/src/components/tabbar/index'
import Taro from '../src/taro/index'

const tabbarConfig = {
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
}

describe('tabbar', () => {
  /** @type {HTMLDivElement} */
  let div

  beforeEach(() => {
    div = document.createElement('div')
    Nerv.render(<Tabbar
      conf={tabbarConfig}
      homePage='pages/index/index'
      tabbarPos={'top'} />, div)
  })
  it('should be able to set/removeTabBarBadge', done => {
    setTabBarBadge({
      index: 0,
      text: 'text'
    }).then(res => {
      let badges
      expect(res.errMsg).toBe('setTabBarBadge:ok')
      badges = div.querySelector('.taro-tabbar-badge')
      expect(badges).toBeTruthy()
      expect(badges.innerHTML).toBe('text')

      removeTabBarBadge({
        index: 0
      }).then(res => {
        expect(res.errMsg).toBe('removeTabBarBadge:ok')
        badges = div.querySelector('.taro-tabbar-badge')
        expect(badges).toBeFalsy()
        done()
      })
    })
  })
  it('should be able to show/hideTabBarRedDot', done => {
    showTabBarRedDot({
      index: 0
    }).then(res => {
      let badges
      expect(res.errMsg).toBe('showTabBarRedDot:ok')
      badges = div.querySelector('.weui-badge_dot')
      expect(badges).toBeTruthy()

      hideTabBarRedDot({
        index: 0
      }).then(res => {
        expect(res.errMsg).toBe('hideTabBarRedDot:ok')
        badges = div.querySelector('.weui-badge_dot')
        expect(badges).toBeFalsy()
        done()
      })
    })
  })
  it('should be able to show/hideTabBar', done => {
    hideTabBar({
      index: 0
    }).then(res => {
      expect(res.errMsg).toBe('hideTabBar:ok')
      let badges = div.querySelector('.taro-tabbar__tabbar-hide')
      expect(badges).toBeTruthy()

      showTabBar({
        index: 0
      }).then(res => {
        expect(res.errMsg).toBe('showTabBar:ok')
        badges = div.querySelector('.taro-tabbar__tabbar-hide')
        expect(badges).toBeFalsy()
        done()
      })
    })
  })
  it('should be able to setTabBarStyle', done => {
    const App = {
      state: { __tabs: tabbarConfig }
    }
    App.setState = jest.fn()
    initTabBarApis(App)

    setTabBarStyle({
      backgroundColor: '#bbbbbb',
      borderStyle: 'black',
      color: '#cccccc'
    }).then(res => {
      expect(res.errMsg).toBe('setTabBarStyle:ok')
      expect(App.setState).toBeCalledWith(expect.objectContaining({
        __tabs: expect.objectContaining({
          backgroundColor: '#bbbbbb',
          borderStyle: 'black',
          color: '#cccccc'
        })
      }))
      done()
    })
  })
  it('should be able to switchTab', done => {
    const mockFn = jest.fn()
    Taro.eventCenter.on('__taroSwitchTab', mockFn)
    switchTab({
      url: '/pages/about/about'
    }).then(res => {
      expect(res.errMsg).toBe('switchTab:ok')
      expect(mockFn).toBeCalledWith(expect.objectContaining({
        url: '/pages/about/about'
      }))
      done()
    })
  })
  it('should be able to setTabBarItem', done => {
    const App = {
      state: { __tabs: tabbarConfig }
    }
    let state
    App.setState = jest.fn().mockImplementation(_state => (state = _state))
    initTabBarApis(App)

    setTabBarItem({
      index: 0,
      iconPath: 'iconPath',
      selectedIconPath: 'selectedIconPath',
      text: 'text'
    }).then(res => {
      expect(res.errMsg).toBe('setTabBarItem:ok')
      expect(state.__tabs.list[0]).toMatchObject({
        iconPath: 'iconPath',
        selectedIconPath: 'selectedIconPath',
        text: 'text'
      })
      done()
    })
  })
})
