import { Component, Prop, h, ComponentInterface, Host, State, Event, EventEmitter, Element } from '@stencil/core'
import Taro from '@tarojs/taro'
import { addLeadingSlash, getCurrentPage, stripBasename, stripSuffix } from '@tarojs/router/dist/utils'
import { IH5RouterConfig } from '@tarojs/taro/types/compile'
import classNames from 'classnames'
import resolvePathname from 'resolve-pathname'

import { splitUrl } from '../../utils'
import { TabbarItem } from './tabbar-item'

const STATUS_SHOW = 0
const STATUS_HIDE = 1
const STATUS_SLIDEOUT = 2

const basicTabBarClassName = 'taro-tabbar__tabbar'
const hideTabBarClassName = 'taro-tabbar__tabbar-hide'
const hideTabBarWithAnimationClassName = 'taro-tabbar__tabbar-slideout'

interface RouterHandler {
  index: string
  text: string
  url: string
  successHandler: Function
  errorHandler: Function
  animation?: boolean
}

export interface Conf {
  color: string
  selectedColor: string
  backgroundColor: string
  borderStyle?: 'black' | 'white'
  list: TabbarList[]
  position?: 'bottom' | 'top'
  custom: boolean
  customRoutes: Record<string, string | string[]>
  mode: IH5RouterConfig['mode']
  basename: string
  homePage: string
  currentPagename: string
}

interface TabbarList {
  pagePath: string
  text: string
  iconPath?: string
  selectedIconPath?: string
  badgeText?: string
  showRedDot?: boolean
}

@Component({
  tag: 'taro-tabbar',
  styleUrl: './style/index.scss'
})
export class Tabbar implements ComponentInterface {
  private homePage = ''

  private customRoutes: Array<string[]> = []

  private tabbarPos: 'top' | 'bottom' = 'bottom'

  @Prop() conf: Conf

  @State() list: TabbarList[]

  @State() borderStyle: Conf['borderStyle']

  @State() backgroundColor: Conf['backgroundColor']

  @State() color: Conf['color']

  @State() selectedColor: Conf['selectedColor']

  @State() selectedIndex = -1

  @State() status: 0 | 1 | 2 = STATUS_SHOW

  @Event({
    eventName: 'longpress'
  }) onLongPress: EventEmitter

  @Element() tabbar: HTMLDivElement

  componentWillLoad () {
    const list = this.conf?.list || []
    const customRoutes = this.conf?.customRoutes || {}
    if (
      Object.prototype.toString.call(list) !== '[object Array]' ||
      list.length < 2 ||
      list.length > 5
    ) {
      throw new Error('tabBar 配置错误')
    }

    this.homePage = addLeadingSlash(this.conf.homePage)
    for (let key in customRoutes) {
      const path = customRoutes[key]
      key = addLeadingSlash(key)
      if (typeof path === 'string') {
        this.customRoutes.push([key, addLeadingSlash(path)])
      } else if (path?.length > 0) {
        this.customRoutes.push(...path.map(p => [key, addLeadingSlash(p)]))
      }
    }

    list.forEach(item => {
      if (item.pagePath.indexOf('/') !== 0) {
        item.pagePath = '/' + item.pagePath
      }
    })

    this.list = list
    this.borderStyle = this.conf.borderStyle
    this.backgroundColor = this.conf.backgroundColor
    this.color = this.conf.color
    this.selectedColor = this.conf.selectedColor
  }

  getCurrentUrl () {
    const routePath = getCurrentPage(this.conf.mode, this.conf.basename)
    return decodeURI(routePath === '/' ? this.homePage : routePath)
  }

  getOriginUrl = (url: string) => {
    const customRoute = this.customRoutes.filter(([, customUrl]) => {
      const pathA = splitUrl(customUrl).path
      const pathB = splitUrl(url).path
      return pathA === pathB
    })
    return stripSuffix(customRoute.length ? customRoute[0][0] : url, '.html')
  }

  getSelectedIndex = (url: string) => {
    let foundIndex = -1
    this.list.forEach(({ pagePath }, idx) => {
      const pathA = splitUrl(url).path
      const pathB = splitUrl(pagePath).path
      if (pathA === pathB) {
        foundIndex = idx
      }
    })
    return foundIndex
  }

  switchTab = (index: number) => {
    this.selectedIndex = index
    Taro.switchTab({
      url: this.list[index].pagePath
    })
  }

  switchTabHandler = ({ url, successHandler, errorHandler }: RouterHandler) => {
    const currentUrl = this.getOriginUrl(this.getCurrentUrl() || this.homePage)
    const nextTab = resolvePathname(url, currentUrl)
    const foundIndex = this.getSelectedIndex(nextTab)

    if (foundIndex > -1) {
      this.switchTab(foundIndex)
      successHandler({
        errMsg: 'switchTab:ok'
      })
    } else {
      errorHandler({
        errMsg: `switchTab:fail page "${nextTab}" is not found`
      })
    }
  }

  routerChangeHandler = (options?) => {
    const to = options?.toLocation?.path
    let currentPage

    if (typeof to === 'string') {
      const routerBasename = this.conf.basename || '/'
      currentPage = stripBasename(addLeadingSlash(to || this.homePage), routerBasename) || '/'
    } else {
      currentPage = this.getCurrentUrl()
    }

    this.selectedIndex = this.getSelectedIndex(this.getOriginUrl(currentPage))
  }

  setTabBarBadgeHandler = ({ index, text, successHandler, errorHandler }: RouterHandler) => {
    const list = [...this.list]
    if (index in list) {
      list[index].showRedDot = false
      list[index].badgeText = text
      successHandler({
        errMsg: 'setTabBarBadge:ok'
      })
    } else {
      errorHandler({
        errMsg: 'setTabBarBadge:fail tabbar item not found'
      })
    }

    this.list = list
  }

  removeTabBarBadgeHandler = ({ index, successHandler, errorHandler }: RouterHandler) => {
    const list = [...this.list]
    if (index in list) {
      list[index].badgeText = null
      list[index].badgeText = null
      successHandler({
        errMsg: 'removeTabBarBadge:ok'
      })
    } else {
      errorHandler({
        errMsg: 'removeTabBarBadge:fail tabbar item not found'
      })
    }

    this.list = list
  }

  showTabBarRedDotHandler = ({ index, successHandler, errorHandler }: RouterHandler) => {
    const list = [...this.list]
    if (index in list) {
      list[index].badgeText = null
      list[index].showRedDot = true
      successHandler({
        errMsg: 'showTabBarRedDot:ok'
      })
    } else {
      errorHandler({
        errMsg: 'showTabBarRedDot:fail tabbar item not found'
      })
    }

    this.list = list
  }

  hideTabBarRedDotHandler = ({ index, successHandler, errorHandler }: RouterHandler) => {
    const list = [...this.list]
    if (index in list) {
      list[index].showRedDot = false
      successHandler({
        errMsg: 'hideTabBarRedDot:ok'
      })
    } else {
      errorHandler({
        errMsg: 'hideTabBarRedDot:fail tabbar item not found'
      })
    }

    this.list = list
  }

  showTabBarHandler = ({ successHandler }) => {
    this.status = STATUS_SHOW
    successHandler({
      errMsg: 'showTabBar:ok'
    })
  }

  hideTabBarHandler = ({ animation, successHandler }) => {
    this.status = animation ? STATUS_SLIDEOUT : STATUS_HIDE
    successHandler({
      errMsg: 'hideTabBar:ok'
    })
  }

  setTabBarStyleHandler = ({ color, selectedColor, backgroundColor, borderStyle, successHandler }) => {
    if (backgroundColor) this.backgroundColor = backgroundColor
    if (borderStyle) this.borderStyle = borderStyle
    if (color) this.color = color
    if (selectedColor) this.selectedColor = selectedColor
    successHandler({
      errMsg: 'setTabBarStyle:ok'
    })
  }

  setTabBarItemHandler = ({ index, iconPath, selectedIconPath, text, successHandler, errorHandler }) => {
    const list = [...this.list]
    if (index in list) {
      if (iconPath) list[index].iconPath = iconPath
      if (selectedIconPath) list[index].selectedIconPath = selectedIconPath
      if (text) list[index].text = text
      successHandler({
        errMsg: 'setTabBarItem:ok'
      })
    } else {
      errorHandler({
        errMsg: 'setTabBarItem:fail tabbar item not found'
      })
    }

    this.list = list
  }

  bindEvent () {
    Taro.eventCenter.on('__taroRouterChange', this.routerChangeHandler)
    Taro.eventCenter.on('__taroSwitchTab', this.switchTabHandler)
    Taro.eventCenter.on('__taroSetTabBarBadge', this.setTabBarBadgeHandler)
    Taro.eventCenter.on('__taroRemoveTabBarBadge', this.removeTabBarBadgeHandler)
    Taro.eventCenter.on('__taroShowTabBarRedDotHandler', this.showTabBarRedDotHandler)
    Taro.eventCenter.on('__taroHideTabBarRedDotHandler', this.hideTabBarRedDotHandler)
    Taro.eventCenter.on('__taroShowTabBar', this.showTabBarHandler)
    Taro.eventCenter.on('__taroHideTabBar', this.hideTabBarHandler)
    Taro.eventCenter.on('__taroSetTabBarStyle', this.setTabBarStyleHandler)
    Taro.eventCenter.on('__taroSetTabBarItem', this.setTabBarItemHandler)
  }

  removeEvent () {
    Taro.eventCenter.off('__taroRouterChange', this.routerChangeHandler)
    Taro.eventCenter.off('__taroSwitchTab', this.switchTabHandler)
    Taro.eventCenter.off('__taroSetTabBarBadge', this.setTabBarBadgeHandler)
    Taro.eventCenter.off('__taroRemoveTabBarBadge', this.removeTabBarBadgeHandler)
    Taro.eventCenter.off('__taroShowTabBarRedDotHandler', this.showTabBarRedDotHandler)
    Taro.eventCenter.off('__taroHideTabBarRedDotHandler', this.hideTabBarRedDotHandler)
    Taro.eventCenter.off('__taroShowTabBar', this.showTabBarHandler)
    Taro.eventCenter.off('__taroHideTabBar', this.hideTabBarHandler)
    Taro.eventCenter.off('__taroSetTabBarStyle', this.setTabBarStyleHandler)
    Taro.eventCenter.off('__taroSetTabBarItem', this.setTabBarItemHandler)
  }

  componentDidLoad () {
    this.tabbarPos = this.tabbar.nextElementSibling ? 'top' : 'bottom'
    this.bindEvent()
    this.routerChangeHandler()
  }

  disconnectedCallback () {
    this.removeEvent()
  }

  render () {
    const { tabbarPos = 'bottom' } = this
    const status = this.status
    const containerCls = classNames('weui-tabbar', {
      [`taro-tabbar__border-${this.borderStyle || 'black'}`]: true
    })
    const shouldHideTabBar = this.selectedIndex === -1 || status === STATUS_HIDE
    const shouldSlideout = status === STATUS_SLIDEOUT

    return (
      <Host
        class={classNames(
          basicTabBarClassName,
          `${basicTabBarClassName}-${tabbarPos}`, {
            [hideTabBarClassName]: shouldHideTabBar,
            [hideTabBarWithAnimationClassName]: shouldSlideout
          })} >
        <div
          class={containerCls}
          style={{
            backgroundColor: this.backgroundColor || '',
            height: 'inherit'
          }}
        >
          {this.list.map((item, index) => {
            const isSelected = this.selectedIndex === index
            let textColor
            let iconPath
            if (isSelected) {
              textColor = this.selectedColor || ''
              iconPath = item.selectedIconPath
            } else {
              textColor = this.color || ''
              iconPath = item.iconPath
            }
            return (
              <TabbarItem
                index={index}
                onSelect={this.switchTab.bind(this)}
                isSelected={isSelected}
                textColor={textColor}
                iconPath={iconPath}
                pagePath={item.pagePath}
                text={item.text}
                badgeText={item.badgeText}
                showRedDot={item.showRedDot}
              />
            )
          })}
        </div>
      </Host>
    )
  }
}
