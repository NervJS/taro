describe('vue3', () => {
  process.env.FRAMEWORK = 'vue3'
  const runtime = require('../../dist/runtime.esm')
  global.document = runtime.document
  global.window = runtime.window
  global.navigator = runtime.navigator
  global.Element = runtime.TaroElement
  global.SVGElement = runtime.SVGElement
  const vue3Plugin = require('@tarojs/plugin-framework-vue3/dist/runtime')
  const Vue = require('vue')

  // Vue.config.devtools = false
  // Vue.config.productionTip = false

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  describe('lifecycle', () => {
    const appDidShow = jest.fn()
    const appDidHide = jest.fn()
    const onLoad = jest.fn()

    const App = Vue.createApp({
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

    const app = vue3Plugin.createVue3App(App, Vue.h, {})

    const Home = {
      onLoad () {
        onLoad.apply(this, arguments)
      },
      template: `
        <view class='index' id='home' ref='current'>home</view>
      `
    }

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
