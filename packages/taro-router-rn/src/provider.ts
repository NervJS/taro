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
    if (navigation && navigation.setOptions) {
      const config = globalAny.__taroAppConfig?.appConfig || {}
      const winOptions = config.window || {}
      const winRnOptions = config.rn || {} // 全局的rn config
      // 多个config的优先级问题，页面rnConfig> 页面config > app.config中rnConfig > app.config.window
      const winScreenOptions = this.isTabBarPage() ? {} : (winRnOptions?.screenOptions || {})
      const { title = '', headerTintColor = '', headerStyle = {}, headerShown = true } = winScreenOptions

      const winRnTitle = this.isTabBarPage() ? winRnOptions?.options?.title || '' : title

      const headerTitle = pageConfig.navigationBarTitleText || winRnTitle || winOptions?.navigationBarTitleText || ''
      const color = pageConfig.navigationBarTextStyle || headerTintColor || winOptions?.navigationBarTextStyle || 'black'
      const bgColor = pageConfig.navigationBarBackgroundColor || headerStyle?.backgroundColor || winOptions?.navigationBarBackgroundColor || '#ffffff'
      let showHeader = headerShown
      if (pageConfig.navigationStyle) {
        showHeader = pageConfig.navigationStyle !== 'custom'
      }
      if (winOptions.navigationStyle) {
        showHeader = winOptions.navigationStyle !== 'custom'
      }

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
        headerShown: showHeader,
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
        if (navigationRef && navigationRef?.current) {
          navigationRef.current.setOptions = navigation.setOptions
        }
        // 若是tabBar页面，确保tabbar内容最新
        if (this.isTabBarPage()) {
          const tabBarVisible = getTabVisible()
          navigation.setOptions({
            tabBarVisible: tabBarVisible
          })
        }
      })
    }
  }

  componentWillUnmount (): void {
    if (this.unSubscribleFocus) { this.unSubscribleFocus() }
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
