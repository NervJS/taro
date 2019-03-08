import 'weui'
import Taro from '@tarojs/taro-h5'
import Nerv from 'nervjs'
import classNames from 'classnames'
import URI from 'urijs'

import TabbarItem from './tabbarItem'
import './style/index.scss'

// const removeLeadingSlash = str => str.replace(/^\.?\//, '')
// const removeTrailingSearch = str => str.replace(/\?[\s\S]*$/, '')
const addLeadingSlash = str => str[0] === '/' ? str : `/${str}`

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

    this.state = {
      list,
      selectedIndex: -1
    }
  }
  homePage = ''

  getCurrentUrl () {
    const url = this.props.conf.mode === 'hash' ? location.hash : location.pathname
    const processedUrl = addLeadingSlash(url.replace(new RegExp(`^#?${this.props.conf.basename}`), ''))
    return processedUrl === '/'
      ? this.homePage
      : processedUrl
  }

  getOriginUrl = url => {
    const customRoute = this.customRoutes.find(([originUrl, customUrl]) => URI(customUrl).equals(url))
    return customRoute ? customRoute[0] : url
  }

  getSelectedIndex = _url => {
    const url = typeof _url === 'string'
      ? URI(_url)
      : _url
    const foundIndex = this.state.list.findIndex(({ pagePath }) => url.equals(pagePath))
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

  switchTabHandler = ({ url, successHandler, errorHandler }) => {
    const currentUrl = this.getOriginUrl(this.getCurrentUrl() || this.homePage)
    const nextTab = URI(url).absoluteTo(currentUrl)
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
    const currentPage = toLocation && toLocation.path
      ? addLeadingSlash(toLocation.path)
      : this.getCurrentUrl()

    this.setState({
      selectedIndex: this.getSelectedIndex(this.getOriginUrl(currentPage))
    })
  }

  bindEvent () {
    Taro.eventCenter.on('__taroSwitchTab', this.switchTabHandler)
    Taro.eventCenter.on('__taroRouterChange', this.routerChangeHandler)
    this.removeEvent = () => {
      Taro.eventCenter.off('__taroSwitchTab', this.switchTabHandler)
      Taro.eventCenter.off('__taroRouterChange', this.routerChangeHandler)
    }
  }

  componentDidMount () {
    this.bindEvent()
    this.routerChangeHandler()
  }

  componentWillUnmount () {
    this.removeEvent()
  }

  render () {
    const { conf } = this.props
    const containerCls = classNames('weui-tabbar', {
      [`taro-tabbar__border-${conf.borderStyle || 'black'}`]: true
    })
    const isShow = this.state.selectedIndex > -1
    return (
      <div className='taro-tabbar__tabbar' style={{display: isShow ? '' : 'none'}}>
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
                onSelect={this.switchTab}
                isSelected={isSelected}
                textColor={textColor}
                iconPath={iconPath}
                text={item.text} />
            )
          })}
        </div>
      </div>
    )
  }
}

export default Tabbar
