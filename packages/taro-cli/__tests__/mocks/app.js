const projAppJS = `
import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'
import './variable.scss'

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/hello/index',
      'pages/expo/index',
      'pages/about/index',
      'pages/scroll/index'
    ],
    window: {
      // backgroundTextStyle: 'light',
      navigationBarBackgroundColor: 'grey',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'blue',
      enablePullDownRefresh: true,
      navigationStyle:'custom'
    },

    tabBar: {
      'color': '#7A7E83',
      'selectedColor': '#3cc51f',
      'borderStyle': 'black',
      'backgroundColor': '#ffffff',
      'list': [
        {
          'pagePath': 'pages/index/index',
          'iconPath': 'image/icon_component.png',
          'selectedIconPath': 'image/icon_component_HL.png',
          'text': '首页'
        },
        {
          'pagePath': 'pages/expo/index',
          'iconPath': 'image/icon_API.png',
          'selectedIconPath': 'image/icon_API_HL.png',
          'text': 'expo'
        }
      ]
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Index/>
    )
  }
}

Taro.render(<App/>, document.getElementById('app'))
`
const simpleAppJS = `
import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'

class App extends Component {

  config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

`
const reduxAppJS = `
import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'

import './app.scss'

const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

`

export { projAppJS, simpleAppJS ,reduxAppJS}
