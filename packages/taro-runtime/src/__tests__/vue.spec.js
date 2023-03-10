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
 *  SOFTWARE.
 */

describe('vue', () => {
  process.env.FRAMEWORK = 'vue'
  const vue2Plugin = require('@tarojs/plugin-framework-vue2')
  const runtime = require('../../dist/runtime.esm')
  global.document = runtime.document
  global.window = runtime.window
  global.navigator = runtime.navigator
  const Vue = require('vue')

  Vue.config.devtools = false
  Vue.config.productionTip = false

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  describe('lifecycle', () => {
    const appDidShow = jest.fn()
    const appDidHide = jest.fn()
    const onLoad = jest.fn()
    // const onUnload = jest.fn()
    // const onShow = jest.fn()
    // const onHide = jest.fn()
    // const onPullDownRefresh = jest.fn()
    // const onReachBottom = jest.fn()
    // const onPageScroll = jest.fn()
    // const onShareAppMessage = jest.fn()
    // const onResize = jest.fn()
    // const onTabItemTap = jest.fn()
    // const onTitleClick = jest.fn()
    // const onOptionMenuClick = jest.fn()
    // const onPopMenuClick = jest.fn()
    // const onPullIntercept = jest.fn()

    const App = ({
      onShow () {
        appDidShow.apply(this, arguments)
      },
      onHide () {
        appDidHide.apply(this, arguments)
      },
      render (h) {
        return h('block', this.$slots.default)
      }
    })

    const app = vue2Plugin.createVueApp(App, Vue)

    const Home = new Vue({
      onLoad () {
        onLoad.apply(this, arguments)
      },
      template: `
        <view class='index' id='home' ref='current'>home</view>
      `
    })

    const home = runtime.createPageConfig(Home, '/page/home')
    app.onLaunch()

    it('App#onShow', () => {
      const obj = {}
      app.onShow(obj)
      expect(appDidShow).toHaveBeenCalledWith(obj)
    })

    it('App#onHide', () => {
      const obj = {}
      app.onHide(obj)
      expect(appDidHide).toHaveBeenCalledWith(obj)
    })

    it.skip('onLoad', () => {
      const obj = {}
      home.onLoad({})
      expect(onLoad).toBeCalledWith(obj)
    })
  })
})
