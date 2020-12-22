import * as React from 'react'
import { camelCase } from 'lodash'
import { getTabVisible, getTabBarPages } from './utils/index'
import { navigationRef } from './rootNavigation'

interface PageProps {
  navigation: any
  currentPath: string
  pageConfig: any
  children: React.ReactNode
}

const globalAny: any = global

export class PageProvider extends React.Component<any> {
  constructor (props: PageProps) {
    super(props)
    // setOptions  在导航navigationRef 并没有暴露出来
    if (navigationRef && navigationRef?.current) {
      navigationRef.current.setOptions = this.props.navigation.setOptions
      //
    }
  }

  componentDidMount (): void {
    const { navigation, pageConfig } = this.props
    const config = globalAny.__taroAppConfig?.appConfig || {}
    const winOptions = config.window || {}

    // 多个config的优先级问题，页面rnConfig> 页面config > app.config中rnConfig > app.config.window
    const winScreenOptions = this.isTabBarPage() ? {} : config.rn?.screenOptions || {}
    const { title = '', headerTintColor = '', headerStyle = {}, headerShown = false } = winScreenOptions

    const headerTitle = pageConfig.navigationBarTitleText || title || winOptions?.navigationBarTitleText || ''
    const color = pageConfig.navigationBarTextStyle || headerTintColor || winOptions?.navigationBarTextStyle || 'black'
    const bgColor = pageConfig.navigationBarBackgroundColor || headerStyle?.backgroundColor || winOptions?.navigationBarBackgroundColor || '#ffffff'
    const customHeader = pageConfig?.navigationStyle !== 'custom' || headerShown || winOptions?.navigationStyle !== 'custom'

    const rnConfig = pageConfig?.rn || {}
    const screenOptions = rnConfig.screenOptions || {}
    const screenHeaderStyle = screenOptions?.headerStyle || {}

    screenOptions.headerStyle = Object.assign({}, {
      backgroundColor: bgColor,
      shadowOffset: { width: 0, height: 0 },
      borderWidth: 0,
      elevation: 0,
      shadowOpacity: 1,
      borderBottomWidth: 0
    }, screenHeaderStyle)
    const navBarParams = Object.assign(winScreenOptions, {
      title: headerTitle,
      headerShown: customHeader,
      headerTintColor: color
    }, screenOptions)
    // 页面的config
    if (pageConfig) {
      if (this.isTabBarPage()) {
        navigation.setParams({
          navigateConfig: navBarParams
        })
      } else {
        navigation.setOptions(navBarParams)
      }
    }
    this.unSubscribleFocus = this.props.navigation.addListener('focus', () => {
      // 若是tabBar页面，页面进入时setOptions tabbar相关，确保tabbar内容最新
      if (navigationRef && navigationRef?.current) {
        navigationRef.current.setOptions = navigation.setOptions
      }
      if (this.isTabBarPage()) {
        const tabBarVisible = getTabVisible()
        navigation.setOptions({
          tabBarVisible: tabBarVisible
        })
      }
    })
  }

  componentWillUnmount (): void {
    this.unSubscribleFocus()
  }

  isTabBarPage (): boolean {
    const { currentPath = '' } = this.props
    const tabPages = getTabBarPages()
    return !!((tabPages.length > 0 && tabPages.indexOf(camelCase(currentPath)) !== -1))
  }

  private unSubscribleFocus

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render () {
    return this.props.children
  }
}
