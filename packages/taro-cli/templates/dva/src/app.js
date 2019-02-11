/* eslint-disable import/first */
/* eslint-disable import/no-commonjs */
import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import dva from './utils/dva'
import 'taro-ui/dist/style/index.scss' // 全局引入一次即可
import './app.scss'
import DevTool from './model/devTool'
import Fetchs from './model/fetch'
import NetTool from './command/netTool'
require('./command/initalApi')

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5') {
  require('nerv-devtools')
}

const tranModel = modelList => modelList.map(e => ({
  namespace: e,
  state: {
    isShow: true
  },
  reducers: {},
  effect: {},
  subscriptions: {}
}))

const dvaApp = dva.createApp({
  initialState: {},
  models: [
    DevTool,
    // 这里用来注册对应的model
    ...tranModel([
      'Index'
    ]),
    Fetchs({
      netTool: NetTool,
      // 全局判断网络请求的入口函数
      // 如果一个网络请求返回的结果不符合自身想要的要求的话 会走到下面的error中
      onGLNetStart: ({ retData, info }) => {
        // if (info.mock) {
        //   return mock[info.mockName]();
        // }
        // if (retData.status === 200 || retData.code === 200) {
        //   return retData;
        // }
        return false
      },
      // 全局网络错误处理入口函数
      // onError 高于 onGLNetError
      // 如果你已经在代码中捕获了单条网络请求错误 那么全局这边将不会处理
      onGLNetError: ({ retData }) => {
        // 这里对所有的网络错误进行统一的处理
        // 如清空token 或者未授权跳转登录页面 以及进行错误提醒 等等
      },
      // 全局网络请求异常捕获
      // 如在网络请求中 你进行的任何一个操作 比如调用一个undefined的函数 那么都会在这里进行全局的捕获
      // 这里跟redux-saga或者dva的全局捕获不同 这里只会接收到网络请求执行过程中的错误
      // 建议跟dva的错误捕获配合进行使用
      onGLNetCatch: ({ error }) => {
        console.log('全局网络请求异常捕获', error)
      }
    })
  ]
})

const store = dvaApp.getStore()

class App extends Component {
  config = {
    pages: [
      'pages/Index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTextStyle: 'black'
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store} />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
