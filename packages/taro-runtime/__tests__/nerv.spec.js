
describe('nerv', () => {
  process.env.FRAMEWORK = 'nerv'
  const runtime = require('../dist/runtime.esm')
  global.document = runtime.document
  global.window = runtime.window
  global.navigator = runtime.navigator
  const React = require('./nerv')

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  describe('lifecycle', () => {
    const appDidShow = jest.fn()
    const appDidHide = jest.fn()
    const onLoad = jest.fn()
    const onUnload = jest.fn()
    const onShow = jest.fn()
    const onHide = jest.fn()
    const onPullDownRefresh = jest.fn()
    const onReachBottom = jest.fn()
    const onPageScroll = jest.fn()
    const onShareAppMessage = jest.fn()
    const onResize = jest.fn()
    const onTabItemTap = jest.fn()
    const onTitleClick = jest.fn()
    const onOptionMenuClick = jest.fn()
    const onPopMenuClick = jest.fn()
    const onPullIntercept = jest.fn()

    class App extends React.Component {
      componentDidShow (...arg) {
        appDidShow(...arg)
      }

      componentDidHide (...arg) {
        appDidHide(...arg)
      }

      render () {
        return this.props.children
      }
    }

    const app = runtime.createReactApp(App, React)

    const homeContainer = React.createRef()

    class Home extends React.Component {
      componentDidShow (...arg) {
        onShow(...arg)
      }

      componentDidHide (...arg) {
        onHide(...arg)
      }

      componentDidMount () {
        onLoad()
      }

      onReachBottom () {
        onReachBottom()
      }

      onPageScroll () {
        onPageScroll.apply(this, arguments)
      }

      onShareAppMessage () {
        onShareAppMessage.apply(this, arguments)
      }

      onResize () {
        onResize.apply(this, arguments)
      }

      onTabItemTap () {
        onTabItemTap.apply(this, arguments)
      }

      onTitleClick () {
        onTitleClick()
      }

      onOptionMenuClick () {
        onOptionMenuClick()
      }

      onPopMenuClick () {
        onPopMenuClick()
      }

      onPullIntercept () {
        onPullIntercept()
      }

      onPullDownRefresh () {
        onPullDownRefresh()
      }

      componentWillUnmount () {
        onUnload()
      }

      render () {
        return <view id='home' ref={homeContainer}>home</view>
      }
    }

    const home = runtime.createPageConfig(Home, '/page/home')

    home.setData = function (_, cb) {
      cb()
    }

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

    it('onLoad', () => {
      home.onLoad()
      expect(onLoad).toBeCalled()
      expect(homeContainer.current.textContent).toBe('home')
    })

    it('onShow', () => {
      home.onShow()
      expect(onShow).toBeCalled()
    })

    it('onPullDownRefresh', () => {
      home.onPullDownRefresh()
      expect(onPullDownRefresh).toBeCalled()
    })

    it('onReachBottom', () => {
      home.onReachBottom()
      expect(onReachBottom).toBeCalled()
    })

    it('onPageScroll', () => {
      const obj = {}
      home.onPageScroll({})
      expect(onPageScroll).toBeCalledWith(obj)
    })

    it('onShareAppMessage', () => {
      const obj = {}
      home.onShareAppMessage(obj)
      expect(onShareAppMessage).toBeCalledWith(obj)
    })

    it('onResize', () => {
      const obj = {}
      home.onResize(obj)
      expect(onResize).toBeCalledWith(obj)
    })

    it('onTabItemTap', () => {
      const obj = { a: 1 }
      home.onTabItemTap(obj)
      expect(onTabItemTap).toBeCalledWith(obj)
    })

    it('onTitleClick', () => {
      home.onTitleClick()
      expect(onTitleClick).toBeCalled()
    })

    it('onOptionMenuClick', () => {
      home.onOptionMenuClick()
      expect(onOptionMenuClick).toBeCalled()
    })

    it('onPopMenuClick', () => {
      home.onPopMenuClick()
      expect(onPopMenuClick).toBeCalled()
    })

    it('onPullIntercept', () => {
      home.onPullIntercept()
      expect(onPullIntercept).toBeCalled()
    })
  })
})
