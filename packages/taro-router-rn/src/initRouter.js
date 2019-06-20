import React from 'react'
import getWrappedScreen from './getWrappedScreen'
import { Image } from 'react-native'
import { getNavigationOptions } from './utils'

const {createStackNavigator, createBottomTabNavigator} = require('react-navigation')

function getTabBarVisible (navigation) {
  let routeState = navigation.state.routes[navigation.state.index]
  const tabBarVisible = routeState.params && routeState.params._tabBarVisible
  if (typeof tabBarVisible === 'boolean') {
    return tabBarVisible
  } else {
    return navigation.state.index === 0 // 第一级不显示 tabBar
  }
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
    RouteConfigs[pageKey] = getWrappedScreen(Screen, Taro, navigationOptions)
  })
  return createStackNavigator(RouteConfigs)
}

function getRootStackPageList ({pageList, tabBar, currentTabPath}) {
  const tabPathList = tabBar.list.map(item => item.pagePath)
  const currentPage = pageList.find(item => item[0] === currentTabPath)
  if (currentPage === undefined) {
    throw new Error('tabBar 的 pagePath 必须是 pages 配置页面')
  }
  const newPageList = pageList.filter(item => tabPathList.indexOf(item[0]) === -1) // 去除 tabPathList 里的 pagePat
  newPageList.unshift(currentPage)
  return newPageList
}

function getTabRouteConfig ({pageList, Taro, tabBar, navigationOptions}) {
  let RouteConfigs = {}
  // newPageList 去除了 tabBar 配置里面的页面，但包含当前 tabBar 页面
  // 防止页面跳转时 tabBar 和 stack 相互干扰，保证每个 tabBar 堆栈的独立性
  tabBar.list.forEach((item) => {
    const currentTabPath = item.pagePath
    const rootStackPageList = getRootStackPageList({pageList, tabBar, currentTabPath})
    RouteConfigs[currentTabPath] = getRootStack({pageList: rootStackPageList, Taro, navigationOptions})
  })
  return RouteConfigs
}

function getTabBarRootStack ({pageList, Taro, tabBar, navigationOptions}) {
  const RouteConfigs = getTabRouteConfig({pageList, Taro, tabBar, navigationOptions})
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
      tabBarVisible: getTabBarVisible(navigation)
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
}

/**
 * @description
 * @param pageList  [['pages/index/index', pagesindexindex]]
 * @param Taro
 * @param navigationOptions 头部导航相关配置 App.config.navigationOptions 全局
 * @param tabBar  tabBar相关配置 App.config.tabBar
 * @returns {*}
 */
const initRouter = (pageList, Taro, {window = {}, tabBar}) => {
  const navigationOptions = getNavigationOptions(window)
  if (tabBar && tabBar.list) {
    return getTabBarRootStack({pageList, Taro, tabBar, navigationOptions})
  } else {
    return getRootStack({pageList, Taro, navigationOptions})
  }
}

export {
  getRootStack, getTabRouteConfig, initRouter, getRootStackPageList
}
