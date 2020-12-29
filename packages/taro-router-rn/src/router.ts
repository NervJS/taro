/* eslint-disable react/no-children-prop */
import * as React from 'react'
import { camelCase } from 'lodash'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { StackHeaderOptions } from '@react-navigation/stack/src/types'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { navigationRef } from './rootNavigation'
import CustomTabBar from './view/TabBar'
import HeadTitle from './view/HeadTitle'
import BackButton from './view/BackButton'
import { getTabItemConfig, getTabVisible, setTabConfig } from './utils/index'

interface WindowConfig {
  pageOrientation?: 'auto' | 'portrait' | 'landscape'
  pullRefresh?: 'YES' | 'NO' | boolean
  allowsBounceVertical?: 'YES' | 'NO'
  navigationBarBackgroundColor?: string
  navigationBarTextStyle?: 'white' | 'black'
  navigationStyle?: 'default' | 'custom'
  navigationBarTitleText?: string
  backgroundTextStyle?: 'dark' | 'light'
  enablePullDownRefresh?: boolean
  onReachBottomDistance?: number
}

interface ITabBarItem {
  pagePath: string // 是 页面路径，必须在 pages 中先定义
  text: string // 是 tab 上按钮文字
  iconPath?: string // 否 图片路径
  selectedIconPath?: string // 否 选中时的图片路径
}

interface ITabBar {
  color?: string
  selectedColor?: string
  backgroundColor?: string
  borderStyle?: 'black' | 'white'
  list: ITabBarItem[],
  position?: 'bottom' | 'top'
  custom?: boolean
}

interface PageItem {
  name: string,
  component: any,
  pagePath: string
}

interface RNConfig {
  linking?: string[],
  screenOptions?: Record<string, any>,
  tabBarOptions?: Record<string, any>,
  options?: Record<string, any>
}

export interface RouterConfig {
  pages: PageItem[],
  tabBar?: ITabBar,
  window?: WindowConfig,
  linkPrefix?: string[],
  rnConfig?: RNConfig
}

export function createRouter (config: RouterConfig): React.ReactNode {
  if (config.tabBar) {
    return createTabNavigate(config)
  } else {
    return createStackNavigate(config)
  }
}

function getTabNames (config: RouterConfig) {
  let tabNames: string[] = []
  const tabBar = config?.tabBar
  if (!tabBar) return tabNames
  tabNames = tabBar.list.map(item => {
    const pagePath = item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`
    return camelCase(pagePath)
  })
  return tabNames
}

function getPageList (config: RouterConfig) {
  // pageList 去除tabbar的页面
  const tabBar = config.tabBar
  const pageList = config.pages
  if (!tabBar) return pageList
  const tabNames = getTabNames(config)
  return pageList.filter(item => tabNames.indexOf(item.name) === -1)
}

function getTabItemOptions (item, index: number) {
  return {
    tabBarLabel: getTabItemConfig(index, 'tabBarLabel') || item.text,
    tabBarBadge: getTabItemConfig(index, 'tabBarBadge'),
    tabBarVisible: getTabVisible(),
    tabBarTestID: `tabbar-${index}`
  }
}

function getHeaderView (title: string, color: string, props: any) {
  return React.createElement(HeadTitle, { label: title, color, headerProps: props }, null)
}

// screen配置的内容
function getStackOptions (config: RouterConfig) {
  const windowOptions = config.window || {}
  const title = windowOptions.navigationBarTitleText || ''
  const headColor = windowOptions.navigationBarTextStyle || 'black'
  const bgColor = windowOptions.navigationBarBackgroundColor || '#ffffff'
  const headerTitleAlign: StackHeaderOptions['headerTitleAlign'] = 'center'
  const defaultOptions = {
    title: title,
    headerShown: windowOptions.navigationStyle !== 'custom',
    headerTitle: (props) => getHeaderView(title, headColor, props),
    headerStyle: {
      backgroundColor: bgColor,
      shadowOffset: { width: 0, height: 0 },
      borderWidth: 0,
      elevation: 0,
      shadowOpacity: 1,
      borderBottomWidth: 0
    },
    headerTintColor: headColor,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerBackTitleVisible: false,
    headerPressColorAndroid: 'rgba(255,255,255,0)',
    headerTitleAlign,
    // eslint-disable-next-line react/display-name
    headerBackImage: ({ tintColor }) => {
      return React.createElement(BackButton, { tintColor }, null)
    }
  }
  const rnConfig = config.rnConfig || {}
  const screenOptions = rnConfig?.screenOptions || {}
  return Object.assign({}, defaultOptions, screenOptions)
}

function getTabItem (config: RouterConfig, tabName: string) {
  const tabBar = config.tabBar
  const pageList = config.pages
  if (!tabBar) return pageList
  let tabItem: PageItem = {
    name: '',
    component: {},
    pagePath: ''
  }
  pageList.forEach(item => {
    if (item.name === tabName) {
      tabItem = item
    }
  })
  return tabItem
}

function createTabStack (config: RouterConfig, parentProps: any) {
  const Tab = createBottomTabNavigator()
  const tabBar = config.tabBar
  const rnConfig = config.rnConfig
  const tabList: any = []
  const userOptions: Record<string, any> = rnConfig?.options || {}
  tabBar?.list.forEach((item, index) => {
    const defaultOptions = Object.assign({}, { tabBarVisible: config.tabBar?.custom ? false : getTabVisible() }, getTabItemOptions(item, index))
    const tabItemOptions = Object.assign({}, defaultOptions, userOptions)
    setTabConfig('tabBarVisible', tabItemOptions.tabBarVisible)
    const path = item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`
    const tabName = camelCase(path)
    const tabPage: PageItem = getTabItem(config, tabName) as PageItem
    const tabNode = React.createElement(Tab.Screen, {
      key: `tab${tabName}`,
      name: `${tabPage.name}`,
      options: tabItemOptions,
      component: tabPage.component,
      ...parentProps
    })
    tabList.push(tabNode)
  })

  const userTabBarOptions = rnConfig?.tabBarOptions || {}
  // tabbarOptions
  const tabBarOptions = Object.assign({
    backBehavior: 'none',
    activeTintColor: tabBar?.selectedColor || '#3cc51f',
    inactiveTintColor: tabBar?.color || '#7A7E83',
    activeBackgroundColor: tabBar?.backgroundColor || '#ffffff',
    inactiveBackgroundColor: tabBar?.backgroundColor || '#ffffff',
    style: tabBar?.borderStyle ? {
      backgroundColor: tabBar?.backgroundColor,
      borderTopColor: (tabBar?.borderStyle === 'black' ? '#000000' : '#ffffff')
    } : {}
  }, userTabBarOptions)

  return React.createElement(Tab.Navigator,
    {
      tabBarOptions: tabBarOptions,
      tabBar: (props) => createTabBar(props, userOptions),
      children: tabList
    },
    tabList)
}

function createTabBar (props, userOptions) {
  return React.createElement(CustomTabBar, { ...props, userOptions })
}

function getLinkingConfig (config: RouterConfig) {
  const prefixes = config?.rnConfig?.linking || config.linkPrefix || []

  const screens: Record<string, string> = {}
  const pageList = getPageList(config)
  pageList.forEach(item => {
    const path: string = item.pagePath.startsWith('/') ? item.pagePath.substr(1) : item.pagePath
    screens[`${item.name}`] = path
  })
  let tabScreen: Record<string, any> = {}
  if (config.tabBar) {
    const tabs: Record<string, string> = {}
    const tabBarList = config.tabBar?.list || []
    tabBarList.forEach((item) => {
      const tabPath = item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`
      const tabName = camelCase(tabPath)
      tabs[`${tabName}`] = tabPath
    })
    tabScreen = {
      tabNav: {
        path: '',
        screens: tabs
      }
    }
  }
  return {
    prefixes: prefixes,
    config: {
      screens: {
        ...tabScreen,
        ...screens
      }
    }
  }
}

function createTabNavigate (config: RouterConfig) {
  const screeList: any = []
  const Stack = createStackNavigator()

  // 第一个页面是tabbar的
  const tabScreen = React.createElement(Stack.Screen, {
    name: 'tabNav',
    key: 'tabScreen',
    children: (props) => createTabStack(config, props)
  }, (props) => createTabStack(config, props))
  screeList.push(tabScreen)
  const pageList = getPageList(config)
  pageList.forEach(item => {
    const screenNode = React.createElement(Stack.Screen,
      {
        key: `${item.name}`,
        name: `${item.name}`,
        component: item.component
      }, null)
    screeList.push(screenNode)
  })

  const linking = getLinkingConfig(config)
  const tabStack = React.createElement(Stack.Navigator,
    {
      screenOptions: () => {
        const options = getCurrentOptions()
        const defaultOptions = getStackOptions(config)
        return Object.assign({}, defaultOptions, options)
      },
      children: screeList
    }, screeList)
  return React.createElement(NavigationContainer, { ref: navigationRef, linking: linking, children: tabStack }, tabStack)
}

function createStackNavigate (config: RouterConfig) {
  const Stack = createStackNavigator()
  const pageList = getPageList(config)
  if (pageList.length <= 0) return null
  const screenChild: any = []
  pageList.forEach(item => {
    const screenNode = React.createElement(Stack.Screen,
      {
        key: `${item.name}`,
        name: `${item.name}`,
        component: item.component
      }, null)
    screenChild.push(screenNode)
  })
  const linking = getLinkingConfig(config)
  const stackNav = React.createElement(Stack.Navigator,
    { screenOptions: getStackOptions(config), children: screenChild }, screenChild)
  return React.createElement(NavigationContainer, { ref: navigationRef, linking: linking, children: stackNav }, stackNav)
}

function getCurrentOptions () {
  const options = navigationRef.current?.getCurrentOptions() || {}
  const params: Record<string, any> = navigationRef.current?.getCurrentRoute()?.params || {}
  const navParams = params?.navigateConfig || {}
  return Object.assign({}, options, navParams)
}
