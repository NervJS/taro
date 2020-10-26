describe('vue', () => {
  process.env.FRAMEWORK = 'vue'
  const runtime = require('../dist/runtime.esm')
  global.document = runtime.document
  global.window = runtime.window
  global.navigator = runtime.navigator
  const Vue = require('./vue').default

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

    const App = new Vue({
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

    const app = runtime.createVueApp(App, Vue)

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
