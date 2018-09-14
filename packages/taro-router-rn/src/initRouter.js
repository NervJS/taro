import React from 'react'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import getWrappedScreen from './getWrappedScreen'
import { Image } from 'react-native'

// 页面默认头部样式
const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: 'grey'
  },
  headerTintColor: 'black'
}

/**
 * @param pageList
 * @param Taro
 * @param navigationOptions config.navigationOptions
 * @returns {*}
 */
function getRootStack ({pageList, Taro, navigationOptions}) {
  let RouteConfigs = {}
  pageList.forEach(v => {
    const pageKey = v[0]
    const Screen = v[1]
    RouteConfigs[pageKey] = getWrappedScreen(Screen, Taro, {enablePullDownRefresh: navigationOptions.enablePullDownRefresh})
  })
  return createStackNavigator(RouteConfigs, {
    navigationOptions: Object.assign({}, defaultNavigationOptions, navigationOptions)
  })
}

/**
 * @description
 * @param pageList  [['pages/index/index', pagesindexindex]]
 * @param Taro
 * @param navigationOptions 头部导航相关配置 App.config.navigationOptions
 * @param tabBar  tabBar相关配置 App.config.tabBar
 * @returns {*}
 */
const initRouter = (pageList, Taro, {navigationOptions = {}, tabBar}) => {
  let RouteConfigs = {}

  if (tabBar && tabBar.list) {
    const tabPathList = tabBar.list.map(item => item.pagePath)

    // newPageList 去除了 tabBar 配置里面的页面，但包含当前 tabBar 页面
    // 防止页面跳转时 tabBar 和 stack 相互干扰，保证每个 tabBar 堆栈的独立性
    tabBar.list.forEach((item) => {
      const currentTabPath = item.pagePath
      // const TabPathList = pageList.find(item => item === tabPath) // 去除当前 tabPth
      const currentPage = pageList.find(item => item[0] === currentTabPath)
      const newPageList = pageList.filter(item => tabPathList.indexOf(item[0]) === -1) // 去除 tabPathList 里的 pagePat
      newPageList.unshift(currentPage)
      RouteConfigs[currentTabPath] = getRootStack({pageList: newPageList, Taro, navigationOptions})
    })
    // TODO tabBar.position
    return createBottomTabNavigator(RouteConfigs, {
      navigationOptions: ({navigation}) => ({
        tabBarIcon: ({focused, tintColor}) => {
          const {routeName} = navigation.state
          const iconConfig = tabBar.list.find(item => item.pagePath === routeName)
          return (
            <Image
              style={{width: 30, height: 30}}
              source={focused ? iconConfig.selectedIconPath : iconConfig.iconPath}
            />
          )
        },
        tabBarLabel: tabBar.list.find(item => item.pagePath === navigation.state.routeName).text,
        tabBarVisible: navigation.state.index === 0 // 第一级不显示 tabBar
      }),
      tabBarOptions: {
        backBehavior: 'none',
        activeTintColor: tabBar.selectedColor || '#3cc51f',
        inactiveTintColor: tabBar.color || '#7A7E83',
        activeBackgroundColor: tabBar.backgroundColor || '#ffffff',
        inactiveBackgroundColor: tabBar.backgroundColor || '#ffffff',
        style: {
          borderColor: tabBar.borderTopColor || '#c6c6c6'
        }
      }
    })
  } else {
    return getRootStack({pageList, Taro, navigationOptions})
  }
}

export default initRouter
