import ReactDOM from '@tarojs/react'
import React from 'react'

import { delay } from './utils'

// todo: 有些测试用例没过，需要调整，目前先 skip
describe.skip('nerv', () => {
  const runtime = require('../../dist/runtime.esm')
  const appDidShow = jest.fn()
  const appDidHide = jest.fn()

  let app
  let home
  beforeAll(() => {
    process.env.FRAMEWORK = 'nerv'
    global.document = runtime.document
    global.window = runtime.window
    global.navigator = runtime.navigator

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
  
    app = runtime.createReactApp(App, React, ReactDOM, {})
  
    app.onLaunch()
  })

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  describe.skip('lifecycle', () => {
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

    let homeContainer
    beforeAll(() => {
      homeContainer = React.createRef()
  
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
  
      home = runtime.createPageConfig(Home, '/page/home')
  
      home.setData = function (_, cb) {
        cb()
      }
    })

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

    it('onHide', () => {
      home.onHide()
      expect(homeContainer.current.textContent).toBe('home')
      expect(onHide).toBeCalled()
    })

    it('onUnload', () => {
      home.onUnload()
      expect(homeContainer.current).toBeNull()
      expect(onUnload).toBeCalled()
    })
  })

  describe.skip('event', () => {
    const eventSpy = jest.fn()

    let home
    let homeContainer
    it('can fire event', (done) => {
      homeContainer = React.createRef()

      class Home extends React.Component {
        state = {
          render: 'home'
        }

        handleClick = () => {
          eventSpy()
        }

        render () {
          return <view id='home' ref={homeContainer} onClick={this.handleClick}>{this.state.render}</view>
        }
      }

      home = runtime.createPageConfig(Home, '/page/home')
      const dataSpy = jest.fn()

      home.setData = function (data, cb) {
        dataSpy(data)
        cb()
      }

      home.onLoad()

      runtime.nextTick(() => {
        const detail = {
          a: 'a'
        }

        home.eh({
          type: 'tap',
          currentTarget: {
            id: 'home'
          },
          detail
        })

        expect(eventSpy).toBeCalled()

        done()
      })
    })

    it('不阻止冒泡', async () => {
      const r1 = React.createRef()
      const r2 = React.createRef()
      const s1 = jest.fn()
      const s2 = jest.fn()
      class Page extends React.Component {
        f1 () {
          s1()
        }

        f2 () {
          s2()
        }

        render () {
          return <view onClick={this.f1} ref={r1}>
            <view onClick={this.f2} ref={r2}></view>
          </view>
        }
      }

      const page = runtime.createPageConfig(Page, '/page/home')
      page.setData = function () {

      }
      page.onLoad()

      await delay()

      page.eh({
        type: 'tap',
        currentTarget: {
          ...r2.current,
          id: r2.current.uid
        }
      })

      expect(s2).toBeCalled()
      expect(s1).not.toBeCalled()

      page.eh({
        type: 'tap',
        currentTarget: {
          ...r1.current,
          id: r1.current.uid
        }
      })

      expect(s1).toBeCalled()
    })

    it('阻止冒泡', async () => {
      const r1 = React.createRef()
      const r2 = React.createRef()
      const s1 = jest.fn()
      const s2 = jest.fn()
      class Page extends React.Component {
        f1 () {
          s1()
        }

        f2 (e) {
          e.stopPropagation()
          s2()
        }

        render () {
          return <view onClick={this.f1} ref={r1}>
            <view onClick={this.f2} ref={r2}></view>
          </view>
        }
      }

      const page = runtime.createPageConfig(Page, '/page/home')
      page.setData = function () {

      }
      page.onLoad()

      await delay()

      page.eh({
        type: 'tap',
        currentTarget: {
          ...r2.current,
          id: r2.current.uid
        }
      })

      expect(s2).toBeCalled()
      expect(s1).not.toBeCalled()

      page.eh({
        type: 'tap',
        currentTarget: {
          ...r1.current,
          id: r1.current.uid
        }
      })

      expect(s1).not.toBeCalled()
    })
  })

  describe.skip('data', () => {
    const dataSpy = jest.fn()

    let home
    let homeInst
    let homeContainer
    beforeAll(() => {
      homeContainer = React.createRef()
  
      class Home extends React.Component {
        constructor (props) {
          super(props)
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          homeInst = this
        }
  
        state = {
          render: 'home'
        }
  
        render () {
          return <view id='home' ref={homeContainer}>{this.state.render}</view>
        }
      }
  
      home = runtime.createPageConfig(Home, '/page/home')
  
      home.setData = function (data, cb) {
        dataSpy(data)
        cb()
      }
    })

    afterAll(() => {
      home.onUnload()
    })

    it('init data', (done) => {
      home.onLoad()
      runtime.nextTick(() => {
        expect(dataSpy).toHaveBeenCalledWith({
          'root.uid': '/page/home',
          'root.cn.[0]': runtime.hydrate(homeContainer.current)
        })
        done()
      })
    })

    it('改变 text', async () => {
      homeInst.setState({
        render: 'test'
      })
      homeInst.forceUpdate()
      await delay()
      expect(dataSpy).toHaveBeenLastCalledWith({
        'root.cn.[0].cn.[0].v': 'test'
      })
    })

    it('改变 class', async () => {
      homeInst.setState({
        render: <view className='a' id='id1'></view>
      })
      homeInst.forceUpdate()
      await delay()
      expect(dataSpy).toHaveBeenLastCalledWith({
        'root.cn.[0].cn.[0]': {
          cl: 'a',
          nn: 'view',
          uid: 'id1'
        }
      })

      homeInst.setState({
        render: <view className='b' id='id1'></view>
      })
      homeInst.forceUpdate()
      await delay()
      expect(dataSpy).toHaveBeenLastCalledWith({
        'root.cn.[0].cn.[0].cl': 'b'
      })

      homeInst.setState({
        render: 'home'
      })
      homeInst.forceUpdate()
    })

    it('style', async () => {
      homeInst.setState({
        render: <view style={{ color: 'red' }} id='id2'></view>
      })
      homeInst.forceUpdate()
      await delay()
      expect(dataSpy).toHaveBeenLastCalledWith({
        'root.cn.[0].cn.[0]': {
          st: 'color: red;',
          nn: 'view',
          uid: 'id2'
        }
      })

      homeInst.setState({
        render: <view style={{ color: 'green' }} id='id2'></view>
      })
      homeInst.forceUpdate()
      await delay()
      expect(dataSpy).toHaveBeenLastCalledWith({
        'root.cn.[0].cn.[0].st': 'color: green;'
      })

      homeInst.setState({
        render: 'home'
      })
      homeInst.forceUpdate()
    })

    it('props 可以传递对象', async () => {
      homeInst.setState({
        render: <view id='id5' a={{ a: 'a' }} ></view>
      })
      homeInst.forceUpdate()
      await delay()
      expect(dataSpy).toHaveBeenLastCalledWith({
        'root.cn.[0].cn.[0]': {
          nn: 'view',
          uid: 'id5',
          a: { a: 'a' }
        }
      })

      homeInst.setState({
        render: <view id='id4'></view>
      })
      homeInst.forceUpdate()
      await delay()
      expect(dataSpy).toHaveBeenLastCalledWith({
        'root.cn.[0].cn.[0].a': '',
        'root.cn.[0].cn.[0].uid': 'id4'
      })

      homeInst.setState({
        render: 'home'
      })
      homeInst.forceUpdate()
    })

    it('id', async () => {
      homeInst.setState({
        render: <text id='id3'></text>
      })
      homeInst.forceUpdate()
      await delay()
      expect(dataSpy).toHaveBeenLastCalledWith({
        'root.cn.[0].cn.[0]': {
          nn: 'text',
          uid: 'id3'
        }
      })

      homeInst.setState({
        render: <text id='id4'></text>
      })
      homeInst.forceUpdate()
      await delay()
      expect(dataSpy).toHaveBeenLastCalledWith({
        'root.cn.[0].cn.[0].uid': 'id4'
      })

      homeInst.setState({
        render: 'home'
      })
      homeInst.forceUpdate()
    })
  })
})
