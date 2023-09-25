import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { BackBehavior } from '@react-navigation/routers/src/TabRouter'
import { CardStyleInterpolators, createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import { StackHeaderMode, StackHeaderOptions } from '@react-navigation/stack/src/types'
import { camelCase } from 'lodash'
import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { navigationRef } from './rootNavigation'
import { getCurrentJumpUrl, getTabInitRoute, getTabItemConfig, getTabVisible, handleUrl, hasJumpAnimate, setTabConfig } from './utils/index'
import BackButton from './view/BackButton'
import HeadTitle from './view/HeadTitle'
import CustomTabBar from './view/TabBar'
import { TabOptions } from './view/TabBarItem'

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
  list: ITabBarItem[]
  position?: 'bottom' | 'top'
  custom?: boolean
}

interface PageItem {
  name: string
  component: any
  pagePath: string
}

interface RNConfig {
  initialRouteName?: string
  linking?: string[]
  screenOptions?: StackNavigationOptions | NativeStackNavigationOptions
  tabOptions?: TabOptions
  tabBarOptions?: Record<string, any>
  tabProps?: {
    backBehavior?: BackBehavior
    lazy?: boolean
    detachInactiveScreens?:boolean
    sceneContainerStyle?: StyleProp<ViewStyle>
  }
  stackProps?: {
    keyboardHandlingEnabled?:boolean
    headerMode?: StackHeaderMode
    detachInactiveScreens?:boolean
  }
  useNativeStack?: boolean
}

export interface RouterConfig {
  pages: PageItem[]
  tabBar?: ITabBar
  window?: WindowConfig
  linkPrefix?: string[]
  rnConfig?: RNConfig
  initParams?:Record<string, any> // 原生启动传递的参数
  initPath?: string // 原生启动时传入的参数路径
  entryPagePath?: string // 默认启动路径
}

export interface RouterOption{
  onReady?: (options)=> void
  onUnhandledAction?: (options)=> void
}

export function createRouter (config: RouterConfig, options:RouterOption) {
  if (config?.tabBar?.list?.length) {
    return createTabNavigate(config,options)
  } else {
    return createStackNavigate(config,options)
  }
}

// 初始化路由相关，入口组件，onLaunch，onShow  
export function getInitOptions (config){
  const initRouteName = getInitRouteName(config)
  const initParams = getInitParams(config, initRouteName)
  const initPath = config.pages.find(p => p.name === initRouteName)?.pagePath
  return {
    path: initPath,
    query:initParams,
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
  return <HeadTitle label={title} color={color} headerProps={props} />
}

// screen配置的内容
function getStackOptions (config: RouterConfig) {
  const windowOptions = config.window || {}
  const title = ''
  const headColor = windowOptions.navigationBarTextStyle || 'white'
  const bgColor = windowOptions.navigationBarBackgroundColor || '#000000'
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
    cardStyle: { elevation: 1 },
    headerBackTitleVisible: false,
    headerTitleAlign,
    // eslint-disable-next-line react/display-name
    headerBackImage: ({ tintColor }) => {
      return <BackButton tintColor={tintColor} />
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

let initRoute

function getInitRouteName (config: RouterConfig) {
  if (initRoute) return initRoute
  const initPath = config.initPath || ''
  const rn = config.rnConfig || {}
  if (initPath) {
    initRoute = handleUrl(initPath).pageName
  } else if (rn?.initialRouteName) {
    initRoute = camelCase(rn.initialRouteName)
  } else if (config.entryPagePath) {
    const entryPagePath = config.entryPagePath.startsWith('/') ? config.entryPagePath : `/${config.entryPagePath}`
    initRoute = config.pages.find(p => p.pagePath === entryPagePath)?.name
  } else {
    initRoute = config.pages[0].name
  }
  return initRoute
}

function getInitTabRoute (config: RouterConfig) {
  const pageList = config.pages
  const tabNames = getTabNames(config)
  const initPath = config.initPath || ''
  let initTabName = ''
  if (initPath) { // 优先原生传入的路由
    const route = handleUrl(initPath).pageName
    for (let i = 0; i < tabNames.length; i++) {
      if (route === tabNames[i]) {
        initTabName = tabNames[i]
        break
      }
    }
  }
  if (!initTabName) {
    for (let i = 0; i < pageList.length; i++) {
      const item = pageList[i]
      if (tabNames.indexOf(item.name) !== -1) {
        initTabName = item.name
        break
      }
    }
  }
  return initTabName
}

function getInitParams (config, pageName) {
  let params: any = {}
  const initRouteName = getInitRouteName(config)
  if (initRouteName === pageName) {
    const initPath = config.initPath || ''
    params = handleUrl(initPath).params
    params = Object.assign({}, params, config.initParams)
  }
  return params
}

function createTabStack (config: RouterConfig, parentProps: any, screenOptions) {
  const Tab = createBottomTabNavigator()
  const tabBar = config.tabBar
  const rnConfig = config.rnConfig
  const tabList: any = []
  const tabOptions: TabOptions = rnConfig?.tabOptions || {}
  tabBar?.list.forEach((item, index) => {
    const defaultOptions = Object.assign({}, { tabBarVisible: config.tabBar?.custom ? false : getTabVisible() }, getTabItemOptions(item, index))
    const tabItemOptions = Object.assign({}, defaultOptions, tabOptions, { headerShown: false, title: item.text })
    setTabConfig('tabBarVisible', tabItemOptions.tabBarVisible)
    const path = item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`
    const tabName = camelCase(path)
    const tabPage: PageItem = getTabItem(config, tabName) as PageItem
    const initParams = getInitParams(config, tabName)
    tabList.push(<Tab.Screen
      key={`tab${tabName}`}
      name={tabPage.name}
      options={tabItemOptions}
      component={tabPage.component}
      initialParams={initParams}
      {...parentProps}
    />)
  })

  const borderColorMap = {
    black: '#000000',
    white: '#ffffff'
  }
  // 允许传入色值、black、white、默认 #000000
  const borderTopColor = tabBar?.borderStyle ? (borderColorMap[tabBar?.borderStyle] || tabBar?.borderStyle) : '#000000'

  const userTabBarOptions = rnConfig?.tabBarOptions || {}
  // tabbarOptions
  const tabBarOptions = Object.assign({
    backBehavior: 'none',
    activeTintColor: tabBar?.selectedColor || '#3cc51f',
    inactiveTintColor: tabBar?.color || '#7A7E83',
    activeBackgroundColor: tabBar?.backgroundColor || '#ffffff',
    inactiveBackgroundColor: tabBar?.backgroundColor || '#ffffff',
    style: {
      backgroundColor: tabBar?.backgroundColor,
      borderTopColor
    }
  }, userTabBarOptions)

  const tabNames = getTabNames(config)
  const tabProps = config.rnConfig?.tabProps || {}

  const tabInitRouteName = getTabInitRoute() || getInitTabRoute(config) || tabNames[0]
  return <Tab.Navigator
    {...tabProps}
    tabBar={(props) => createTabBar(props, tabOptions, tabBarOptions)}
    initialRouteName={tabInitRouteName}
    screenOptions={screenOptions}
  >{tabList}</Tab.Navigator>
}

function createTabBar (props, tabOptions: TabOptions, tabBarOptions) {
  return <CustomTabBar {...props} tabOptions={tabOptions} {...tabBarOptions} />
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

function defaultOnUnhandledAction (action){
  // @ts-ignore
  if (process.env.NODE_ENV === 'production') {
    return
  }
  const payload: Record<string, any> | undefined = action.payload
  let message = `The action '${action.type}'${
    payload ? ` with payload ${JSON.stringify(action.payload)}` : ''
  } was not handled by any navigator.`
  switch (action.type) {
    case 'NAVIGATE':
    case 'PUSH':
    case 'REPLACE':
    case 'JUMP_TO':
      if (payload?.name) {
        const pageName = getCurrentJumpUrl() ?? payload?.name
        message += `\n\nDo you have a screen '${pageName}'?\n\nIf you're trying to navigate to a screen in a nested navigator, see https://reactnavigation.org/docs/nesting-navigators#navigating-to-a-screen-in-a-nested-navigator.`
      } else {
        message += `\n\nYou need to pass the name of the screen to navigate to.\n\nSee https://reactnavigation.org/docs/navigation-actions for usage.`
      }

      break
    case 'GO_BACK':
    case 'POP':
    case 'POP_TO_TOP':
      message += `\n\nIs there any screen to go back to?`
      break
    case 'OPEN_DRAWER':
    case 'CLOSE_DRAWER':
    case 'TOGGLE_DRAWER':
      message += `\n\nIs your screen inside a Drawer navigator?`
      break
  }
  message += `\n\nThis is a development-only warning and won't be shown in production.`
  console.error(message)
}

function handlePageNotFound (action, options){
  const routeObj:Record<string,any> = action?.payload  ?? {}
  if(routeObj?.name){
    options?.onUnhandledAction && options?.onUnhandledAction({
      path: getCurrentJumpUrl() ?? routeObj?.name,
      query: routeObj?.params ?? {}
    })
  }
  // 监听了onUnhandledAction，导航默认打印错误就不执行了, 把源码中默认打印加一下😭
  defaultOnUnhandledAction(action)
}

function createTabNavigate (config: RouterConfig, options: RouterOption) {
  const Stack = config.rnConfig?.useNativeStack ? createNativeStackNavigator() : createStackNavigator()
  const pageList = getPageList(config)
  const linking = getLinkingConfig(config)
  const stackProps = config.rnConfig?.stackProps
  const screenOptions = getStackOptions(config)

  return <NavigationContainer
    ref={navigationRef}
    linking={linking}
    onUnhandledAction = {(action)=> handlePageNotFound(action, options)}
  >
    <Stack.Navigator
      detachInactiveScreens={false}
      {...stackProps}
      // @ts-ignore
      screenOptions={() => ({
        ...screenOptions,
        animation: hasJumpAnimate() ? 'default' : 'none',
        animationEnabled: !!hasJumpAnimate()
      })}
      initialRouteName={getInitRouteName(config)}
    >
      <Stack.Screen
        name='tabNav'
        key='tabScreen'
        options={{
          headerShown: false
        }}
      >{(props) => createTabStack(config, props, screenOptions)}</Stack.Screen>
      {pageList.map(item => {
        const initParams = getInitParams(config, item.name)
        return <Stack.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          initialParams={initParams}
        ></Stack.Screen>
      })}
    </Stack.Navigator>
  </NavigationContainer>
}

function createStackNavigate (config: RouterConfig, options:RouterOption) {
  const Stack = config.rnConfig?.useNativeStack ? createNativeStackNavigator() : createStackNavigator()
  const pageList = getPageList(config)
  if (pageList.length <= 0) return null
  const linking = getLinkingConfig(config)
  const stackProps = config.rnConfig?.stackProps
  const screenOptions = getStackOptions(config)

  return <NavigationContainer
    ref={navigationRef}
    linking={linking}
    onUnhandledAction = {(action)=> handlePageNotFound(action, options)}
  >
    <Stack.Navigator
      detachInactiveScreens={false}
      {...stackProps}
      // @ts-ignore
      screenOptions={() => ({
        ...screenOptions,
        animation: hasJumpAnimate() ? 'default' : 'none',
        animationEnabled: !!hasJumpAnimate()
      })}
      initialRouteName={getInitRouteName(config)}
    >{pageList.map(item => {
        const initParams = getInitParams(config, item.name)
        return <Stack.Screen key={item.name} name={item.name} component={item.component} initialParams={initParams} />
      })}</Stack.Navigator>
  </NavigationContainer>
}
