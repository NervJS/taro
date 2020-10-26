import React from 'react' // eslint-disable-line
import getWrappedScreen from './getWrappedScreen'
import { getNavigationOptions } from './utils'
import { TabBarIcon } from './TabBarIcon'

const { createStackNavigator, createBottomTabNavigator } = require('react-navigation')

function getTaroTabBarIconConfig (index, key) {
  const _taroTabBarIconConfig = global._taroTabBarIconConfig || {}
  return _taroTabBarIconConfig[index] && _taroTabBarIconConfig[index][key]
}

function getRouteParam (navigation, name) {
  const routeState = navigation.state.routes[navigation.state.index]
  return routeState.params && routeState.params[name]
}

function getTabBarVisibleFlag (navigation) {
  const tabBarVisible = getRouteParam(navigation, '_tabBarVisible')
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
function getRootStack ({ pageList, Taro, navigationOptions }) {
  const RouteConfigs = {}
  pageList.forEach(v => {
    const pageKey = v[0]
    const Screen = v[1]
    RouteConfigs[pageKey] = getWrappedScreen(Screen, Taro, navigationOptions)
  })
  return createStackNavigator(RouteConfigs, { headerLayoutPreset: 'center' })
}

function getRootStackPageList ({ pageList, tabBar, currentTabPath }) {
  const tabPathList = tabBar.list.map(item => item.pagePath)
  const currentPage = pageList.find(item => item[0] === currentTabPath)
  if (currentPage === undefined) {
    throw new Error('tabBar 的 pagePath 必须是 pages 配置页面')
  }
  const newPageList = pageList.filter(item => tabPathList.indexOf(item[0]) === -1) // 去除 tabPathList 里的 pagePat
  newPageList.unshift(currentPage)
  return newPageList
}

function getTabRouteConfig ({ pageList, Taro, tabBar, navigationOptions }) {
  const RouteConfigs = {}
  // newPageList 去除了 tabBar 配置里面的页面，但包含当前 tabBar 页面
  // 防止页面跳转时 tabBar 和 stack 相互干扰，保证每个 tabBar 堆栈的独立性
  tabBar.list.forEach((item) => {
    const currentTabPath = item.pagePath
    const rootStackPageList = getRootStackPageList({ pageList, tabBar, currentTabPath })
    RouteConfigs[currentTabPath] = getRootStack({ pageList: rootStackPageList, Taro, navigationOptions })
  })
  return RouteConfigs
}

function getTabBarRootStack ({ pageList, Taro, tabBar, navigationOptions }) {
  const RouteConfigs = getTabRouteConfig({ pageList, Taro, tabBar, navigationOptions })
  // TODO tabBar.position
  return createBottomTabNavigator(RouteConfigs, {
    initialRouteName: pageList[0][0], // app.json里pages的顺序，第一项是默认打开页
    navigationOptions: ({ navigation }) => ({ // 这里得到的是 tab 的 navigation
      // eslint-disable-next-line react/display-name
      tabBarIcon: ({ focused, _ }) => {
        const { routeName } = navigation.state
        const iconConfig = tabBar.list.find(item => item.pagePath === routeName)
        const tabBarIndex = tabBar.list.findIndex(item => item.pagePath === routeName) + 1
        const isRedDotShow = getTaroTabBarIconConfig(tabBarIndex, 'isRedDotShow')
        const isBadgeShow = getTaroTabBarIconConfig(tabBarIndex, 'isBadgeShow')
        const badgeText = getTaroTabBarIconConfig(tabBarIndex, 'badgeText')
        const selectedIconPath = getTaroTabBarIconConfig(tabBarIndex, 'itemSelectedIconPath')
        const iconPath = getTaroTabBarIconConfig(tabBarIndex, 'itemIconPath')
        return (
          <TabBarIcon
            focused={focused}
            iconConfig={iconConfig}
            isRedDotShow={isRedDotShow}
            badgeText={badgeText}
            isBadgeShow={isBadgeShow}
            selectedIconPath={selectedIconPath || iconConfig.selectedIconPath}
            iconPath={iconPath || iconConfig.iconPath}
          />
        )
      },
      tabBarLabel: (() => {
        const { routeName } = navigation.state
        const tabBarIndex = tabBar.list.findIndex(item => item.pagePath === routeName) + 1
        const itemText = getTaroTabBarIconConfig(tabBarIndex, 'itemText')
        return itemText || tabBar.list.find(item => item.pagePath === navigation.state.routeName).text
      })(),
      tabBarVisible: getTabBarVisibleFlag(navigation)
    }),
    /**
     * color ✅
     * selectedColor ✅
     * backgroundColor ✅
     * borderStyle 🤔
     * position ❌
     * custom ❌
     */
    tabBarOptions: {
      backBehavior: 'none',
      activeTintColor: tabBar.selectedColor || '#3cc51f',
      inactiveTintColor: tabBar.color || '#7A7E83',
      activeBackgroundColor: tabBar.backgroundColor || '#ffffff',
      inactiveBackgroundColor: tabBar.backgroundColor || '#ffffff',
      style: tabBar.borderStyle ? {
        backgroundColor: tabBar.borderStyle
      } : {}
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
const initRouter = (pageList, Taro, { window = {}, tabBar }) => {
  const navigationOptions = getNavigationOptions(window)
  if (tabBar && tabBar.list) {
    return getTabBarRootStack({ pageList, Taro, tabBar, navigationOptions })
  } else {
    return getRootStack({ pageList, Taro, navigationOptions })
  }
}

export {
  getRootStack, getTabRouteConfig, initRouter, getRootStackPageList
}
