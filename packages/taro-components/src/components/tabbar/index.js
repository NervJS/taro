import 'weui'
import Taro from '@tarojs/taro-h5'
import Nerv, { findDOMNode } from 'nervjs'
import classNames from 'classnames'
import resolvePathname from 'resolve-pathname'

import TabbarItem from './tabbarItem'
import { splitUrl } from '../../utils'
import './style/index.scss'

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

class Tabbar extends Nerv.Component {
  constructor (props) {
    super(...arguments)
    const list = props.conf.list
    const customRoutes = props.conf.customRoutes
    if (
      Object.prototype.toString.call(list) !== '[object Array]' ||
      list.length < 2 ||
      list.length > 5
    ) {
      throw new Error('tabBar 配置错误')
    }

    this.homePage = addLeadingSlash(props.homePage)
    this.customRoutes = []
    for (let key in customRoutes) {
      this.customRoutes.push([key, customRoutes[key]])
    }

    list.forEach(item => {
      if (item.pagePath.indexOf('/') !== 0) {
        item.pagePath = '/' + item.pagePath
      }
    })

    this.state = {
      list,
      selectedIndex: -1,
      status: STATUS_SHOW
    }
  }

  homePage = ''
  tabbar = null
  tabbarPos = 'bottom'

  getCurrentUrl () {
    const currentPagename = this.props.currentPagename
    const routerMode = this.props.conf.mode
    const routerBasename = this.props.conf.basename || '/'
    let url
    if (routerMode === 'hash') {
      const href = window.location.href
      const hashIndex = href.indexOf('#')
      url = hashIndex === -1
        ? ''
        : href.substring(hashIndex + 1)
    } else if (routerMode === 'multi') {
      url = currentPagename
    } else {
      url = location.pathname
    }
    const processedUrl = addLeadingSlash(stripBasename(url, routerBasename))
    return processedUrl === '/'
      ? this.homePage
      : processedUrl
  }

  getOriginUrl = url => {
    const customRoute = this.customRoutes.filter(([originUrl, customUrl]) => {
      const patha = splitUrl(customUrl).path
      const pathb = splitUrl(url).path
      return patha === pathb
    })
    return customRoute.length ? customRoute[0][0] : url
  }

  getSelectedIndex = url => {
    let foundIndex = -1
    this.state.list.forEach(({ pagePath }, idx) => {
      const patha = splitUrl(url).path
      const pathb = splitUrl(pagePath).path
      if (patha === pathb) {
        foundIndex = idx
      }
    })
    return foundIndex
  }

  switchTab = (index) => {
    this.setState({
      selectedIndex: index
    })
    Taro.redirectTo && Taro.redirectTo({
      url: this.state.list[index].pagePath
    })
  }

  tabbarRef = (ref) => {
    if (!ref) return

    const domNode = findDOMNode(ref)
    this.tabbar = domNode
  }

  switchTabHandler = ({ url, successHandler, errorHandler }) => {
    const routerMode = this.props.conf.mode
    const currentUrl = routerMode === 'multi'
      ? this.props.currentPagename
      : this.getOriginUrl(this.getCurrentUrl() || this.homePage)
    const nextTab = resolvePathname(url, currentUrl)
    const foundIndex = this.getSelectedIndex(nextTab)

    if (foundIndex > -1) {
      this.switchTab(foundIndex)
      successHandler({
        errMsg: `switchTab:ok`
      })
    } else {
      errorHandler({
        errMsg: `switchTab:fail page "${nextTab}" is not found`
      })
    }
  }

  routerChangeHandler = ({ toLocation } = {}) => {
    let currentPage

    if (toLocation && toLocation.path) {
      const tmpPath = addLeadingSlash(toLocation.path)
      currentPage = tmpPath === '/'
        ? this.homePage
        : tmpPath
    } else {
      currentPage = this.getCurrentUrl()
    }

    this.setState({
      selectedIndex: this.getSelectedIndex(this.getOriginUrl(currentPage))
    })
  }

  setTabBarBadgeHandler = ({ index, text, successHandler, errorHandler }) => {
    const list = this.state.list
    if (index in list) {
      list[index].showRedDot = false
      list[index].badgeText = text
      this.setState({}, () => {
        successHandler({
          errMsg: 'setTabBarBadge:ok'
        })
      })
    } else {
      errorHandler({
        errMsg: `setTabBarBadge:fail tabbar item not found`
      })
    }
  }

  removeTabBarBadgeHandler = ({ index, successHandler, errorHandler }) => {
    const list = this.state.list
    if (index in list) {
      list[index].badgeText = null
      this.setState({}, () => {
        successHandler({
          errMsg: 'removeTabBarBadge:ok'
        })
      })
    } else {
      errorHandler({
        errMsg: `removeTabBarBadge:fail tabbar item not found`
      })
    }
  }

  showTabBarRedDotHandler = ({ index, successHandler, errorHandler }) => {
    const list = this.state.list
    if (index in list) {
      list[index].badgeText = null
      list[index].showRedDot = true
      this.setState({}, () => {
        successHandler({
          errMsg: 'showTabBarRedDot:ok'
        })
      })
    } else {
      errorHandler({
        errMsg: `showTabBarRedDot:fail tabbar item not found`
      })
    }
  }

  hideTabBarRedDotHandler = ({ index, successHandler, errorHandler }) => {
    const list = this.state.list
    if (index in list) {
      list[index].showRedDot = false
      this.setState({}, () => {
        successHandler({
          errMsg: 'hideTabBarRedDot:ok'
        })
      })
    } else {
      errorHandler({
        errMsg: `hideTabBarRedDot:fail tabbar item not found`
      })
    }
  }

  showTabBarHandler = ({ successHandler }) => {
    this.setState({
      status: STATUS_SHOW
    }, () => {
      successHandler({
        errMsg: 'showTabBar:ok'
      })
    })
  }

  hideTabBarHandler = ({ animation, successHandler }) => {
    this.setState({
      status: animation ? STATUS_SLIDEOUT : STATUS_HIDE
    }, () => {
      successHandler({
        errMsg: 'hideTabBar:ok'
      })
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

  componentDidMount () {
    if (!this.tabbar) return

    this.tabbarPos = this.tabbar.nextElementSibling
      ? 'top'
      : 'bottom'
    this.bindEvent()
    this.routerChangeHandler()
  }

  componentWillUnmount () {
    this.removeEvent()
  }

  render () {
    const { conf, tabbarPos = 'bottom' } = this.props
    const { status } = this.state
    const containerCls = classNames('weui-tabbar', {
      [`taro-tabbar__border-${conf.borderStyle || 'black'}`]: true
    })
    const shouldHideTabBar = this.state.selectedIndex === -1 || status === STATUS_HIDE
    const shouldSlideout = status === STATUS_SLIDEOUT

    return (
      <div
        ref={this.tabbarRef}
        className={classNames(
          basicTabBarClassName,
          `${basicTabBarClassName}-${tabbarPos}`, {
            [hideTabBarClassName]: shouldHideTabBar,
            [hideTabBarWithAnimationClassName]: shouldSlideout
          })} >
        <div
          className={containerCls}
          style={{
            backgroundColor: conf.backgroundColor || ''
          }}
        >
          {this.state.list.map((item, index) => {
            const isSelected = this.state.selectedIndex === index
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
      </div>
    )
  }
}

export default Tabbar
