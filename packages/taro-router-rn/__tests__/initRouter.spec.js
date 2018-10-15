import React from 'react'
import { getRootStackPageList, getRootStack, initRouter } from '../src/initRouter'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Welcome',
    gesturesEnabled: true,
    headerStyle: [{backgroundColor: 'red'}]
  })

  render () {
    return null
  }
}

const tabBar = {
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

const pageList = [
  ['pages/index/index', HomeScreen],
  ['pages/hello/index', HomeScreen],
  ['pages/expo/index', HomeScreen],
  ['pages/about/index', HomeScreen]
]

const window = {
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'grey',
  navigationBarTitleText: 'WeChat',
  navigationBarTextStyle: 'blue',
  enablePullDownRefresh: true,
  navigationStyle: 'custom'
}

const navigationOptions = {
  'backgroundColor': 'grey',
  'enablePullDownRefresh': true,
  'headerTintColor': 'blue',
  'navigationStyle': 'custom',
  'title': 'WeChat'
}

describe('initRouter', function () {
// getRootStackPageList
  describe('getRootStackPageList', () => {
    const pageList = [
      ['pages/index/index', ''],
      ['pages/hello/index', ''],
      ['pages/expo/index', ''],
      ['pages/about/index', '']
    ]
    it('pop tabPathList and unshift currentTabPath ', () => {
      const currentTabPath = 'pages/expo/index'
      const resPageList = getRootStackPageList({pageList, tabBar, currentTabPath})
      expect(resPageList).toEqual(
        [
          ['pages/expo/index', ''],
          ['pages/hello/index', ''],
          ['pages/about/index', '']
        ]
      )
    })

    it('currentTabPath not in pageList', () => {
      const pageList = []
      const currentTabPath = 'pages/hello/index'
      expect(() => {
        getRootStackPageList({pageList, tabBar, currentTabPath})
      }).toThrow('tabBar 的 pagePath 必须是 pages 配置页面')
    })
  })

  // getRootStack
  describe('getRootStack', () => {
    let Taro = {}
    it('renders successfully', () => {
      const RootStack = getRootStack({pageList, Taro, navigationOptions})
      const wrapper = shallow(<RootStack />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    it('should has navigation props', () => {
      const RootStack = getRootStack({pageList, Taro, navigationOptions})
      const wrapper = shallow(<RootStack />)
      expect(typeof wrapper.props().navigation).toEqual('object')
    })
  })

  // initRouter
  describe('initRouter', () => {
    let Taro = {}
    it('without tabBar', () => {
      const RootStack = initRouter(pageList, Taro, {window})
      const wrapper = shallow(<RootStack />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
    it('with tabBar', () => {
      const TabRootStack = initRouter(pageList, Taro, {window, tabBar})
      const wrapper = shallow(<TabRootStack />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })

})
