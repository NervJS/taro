import { Component, Prop, h, ComponentInterface, Host, State, Event, EventEmitter, Element } from '@stencil/core'
import classNames from 'classnames'
import resolvePathname from 'resolve-pathname'
import { splitUrl } from '../../utils'
import { TabbarItem } from './tabbar-item'
const Taro = require('@tarojs/taro')

// const removeLeadingSlash = str => str.replace(/^\.?\//, '')
// const removeTrailingSearch = str => str.replace(/\?[\s\S]*$/, '')
const addLeadingSlash = str => str[0] === '/' ? str : `/${str}`

const hasBasename = (path, prefix) =>
  new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path)

const stripBasename = (path, prefix) =>
  hasBasename(path, prefix) ? path.substr(prefix.length) : path

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
  customRoutes: Record<string, string>
  mode: 'hash' | 'browser'
  basename: string
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

  @State() selectedIndex = -1

  @State() status: 0 | 1 | 2 = STATUS_SHOW

  @Event({
    eventName: 'longpress'
  }) onLongPress: EventEmitter

  @Element() tabbar: HTMLDivElement

  constructor () {
    const list = this.conf.list
    const customRoutes = this.conf.customRoutes
    if (
      Object.prototype.toString.call(list) !== '[object Array]' ||
      list.length < 2 ||
      list.length > 5
    ) {
      throw new Error('tabBar 配置错误')
    }

    this.homePage = addLeadingSlash(this.homePage)
    for (const key in customRoutes) {
      this.customRoutes.push([key, customRoutes[key]])
    }

    list.forEach(item => {
      if (item.pagePath.indexOf('/') !== 0) {
        item.pagePath = '/' + item.pagePath
      }
    })

    this.list = list
  }

  getCurrentUrl () {
    const routerMode = this.conf.mode
    const routerBasename = this.conf.basename || '/'
    let url
    if (routerMode === 'hash') {
      const href = window.location.href
      const hashIndex = href.indexOf('#')
      url = hashIndex === -1
        ? ''
        : href.substring(hashIndex + 1)
    } else {
      url = location.pathname
    }
    const processedUrl = addLeadingSlash(stripBasename(url, routerBasename))
    return processedUrl === '/' ? this.homePage : processedUrl
  }

  getOriginUrl = (url: string) => {
    const customRoute = this.customRoutes.filter(([, customUrl]) => {
      const patha = splitUrl(customUrl).path
      const pathb = splitUrl(url).path
      return patha === pathb
    })
    return customRoute.length ? customRoute[0][0] : url
  }

  getSelectedIndex = (url: string) => {
    let foundIndex = -1
    this.list.forEach(({ pagePath }, idx) => {
      const patha = splitUrl(url).path
      const pathb = splitUrl(pagePath).path
      if (patha === pathb) {
        foundIndex = idx
      }
    })
    return foundIndex
  }

  switchTab = (index: number) => {
    this.selectedIndex = index
    Taro.redirectTo({
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
    let toLocation
    let currentPage

    if (options) {
      toLocation = options.toLocation
    }

    if (toLocation && toLocation.path) {
      const tmpPath = addLeadingSlash(toLocation.path)
      currentPage = tmpPath === '/'
        ? this.homePage
        : tmpPath
    } else {
      currentPage = this.getCurrentUrl()
    }

    this.selectedIndex = this.getSelectedIndex(this.getOriginUrl(currentPage))
  }

  setTabBarBadgeHandler = ({ index, text, errorHandler }: RouterHandler) => {
    const list = this.list
    if (index in list) {
      this.list[index].showRedDot = false
      this.list[index].badgeText = text
    } else {
      errorHandler({
        errMsg: 'setTabBarBadge:fail tabbar item not found'
      })
    }
  }

  removeTabBarBadgeHandler = ({ index, successHandler, errorHandler }: RouterHandler) => {
    const list = this.list
    if (index in list) {
      this.list[index].badgeText = null
      this.list[index].badgeText = null
      successHandler({
        errMsg: 'removeTabBarBadge:ok'
      })
    } else {
      errorHandler({
        errMsg: 'removeTabBarBadge:fail tabbar item not found'
      })
    }
  }

  showTabBarRedDotHandler = ({ index, successHandler, errorHandler }: RouterHandler) => {
    const list = this.list
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
  }

  hideTabBarRedDotHandler = ({ index, successHandler, errorHandler }: RouterHandler) => {
    const list = this.list
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

  bindEvent () {
    Taro.eventCenter.on('__taroRouterChange', this.routerChangeHandler)
    Taro.eventCenter.on('__taroSwitchTab', this.switchTabHandler)
    Taro.eventCenter.on('__taroSetTabBarBadge', this.setTabBarBadgeHandler)
    Taro.eventCenter.on('__taroRemoveTabBarBadge', this.removeTabBarBadgeHandler)
    Taro.eventCenter.on('__taroShowTabBarRedDotHandler', this.showTabBarRedDotHandler)
    Taro.eventCenter.on('__taroHideTabBarRedDotHandler', this.hideTabBarRedDotHandler)
    Taro.eventCenter.on('__taroShowTabBar', this.showTabBarHandler)
    Taro.eventCenter.on('__taroHideTabBar', this.hideTabBarHandler)
  }

  removeEvent () {
    Taro.eventCenter.off('__taroRouterChange', this.routerChangeHandler)
    Taro.eventCenter.off('__taroSwitchTab', this.switchTabHandler)
    Taro.eventCenter.off('__taroSetTabBarBadge', this.setTabBarBadgeHandler)
    Taro.eventCenter.off('__taroRemoveTabBarBadge', this.removeTabBarBadgeHandler)
    Taro.eventCenter.off('__taroShowTabBarRedDotHandler', this.showTabBarRedDotHandler)
    Taro.eventCenter.off('__taroHideTabBarRedDotHandler', this.hideTabBarRedDotHandler)
    Taro.eventCenter.off('__taroShowTabBarHandler', this.showTabBarHandler)
    Taro.eventCenter.off('__taroHideTabBarHandler', this.hideTabBarHandler)
  }

  componentDidLoad () {
    this.tabbarPos = this.tabbar.nextElementSibling ? 'top' : 'bottom'
    this.bindEvent()
    this.routerChangeHandler()
  }

  componentDidUnload () {
    this.removeEvent()
  }

  render () {
    const { conf, tabbarPos = 'bottom' } = this
    const status = this.status
    const containerCls = classNames('weui-tabbar', {
      [`taro-tabbar__border-${conf.borderStyle || 'black'}`]: true
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
            backgroundColor: conf.backgroundColor || ''
          }}
        >
          {this.list.map((item, index) => {
            const isSelected = this.selectedIndex === index
            let textColor
            let iconPath
            if (isSelected) {
              textColor = conf.selectedColor
              iconPath = item.selectedIconPath
            } else {
              textColor = conf.color || ''
              iconPath = item.iconPath
            }
            return (
              <TabbarItem
                index={index}
                onSelect={this.switchTab.bind(this)}
                isSelected={isSelected}
                textColor={textColor}
                iconPath={iconPath}
                text={item.text}
                badgeText={item.badgeText}
                showRedDot={item.showRedDot} />
            )
          })}
        </div>
      </Host>
    )
  }
}
