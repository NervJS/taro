import 'weui'
import Taro from '@tarojs/taro-h5'
import Nerv from 'nervjs'
import classNames from 'classnames'

import TabbarItem from './tabbarItem'
import './style/index.scss'

const removeLeadingSlash = str => str.replace(/^\.?\//, '')
const removeTrailingSearch = str => str.replace(/\?[\s\S]*$/, '')

class Tabbar extends Nerv.Component {
  constructor (props) {
    super(...arguments)
    const list = props.conf.list
    if (
      Object.prototype.toString.call(list) !== '[object Array]' ||
      list.length < 2 ||
      list.length > 5
    ) {
      throw new Error('tabBar 配置错误')
    }

    this.homePage = removeLeadingSlash(props.homePage)

    this.state = {
      list,
      isShow: false,
      selectedIndex: 0
    }
  }
  componentDidMount () {
    this.bindEvent()
    this.hashChangeHandler()
  }

  componentUnMount () {
    this.removeEvent()
  }

  getCurrentPathname () {
    const path = this.props.mode === 'hash' ? location.hash : location.pathname
    const pathname = path.replace(new RegExp(`^#?${this.props.basename}/?`), '')

    return removeLeadingSlash(removeTrailingSearch(pathname))
  }

  hashChangeHandler ({ toLocation } = {}) {
    let currentPage

    if (toLocation && toLocation.path) {
      currentPage = removeLeadingSlash(toLocation.path)
    } else {
      currentPage = this.getCurrentPathname() || this.homePage
    }

    const stateObj = { isShow: false }
    const foundIdx = this.state.list.findIndex(v => {
      return v.pagePath.indexOf(currentPage) > -1
    })
    if (foundIdx > -1) {
      Object.assign(stateObj, {
        isShow: true,
        selectedIndex: foundIdx
      })
    }
    this.setState(stateObj)
  }

  hideBar () {
    this.setState({
      isShow: false
    })
  }

  showBar () {
    this.setState({
      isShow: true
    })
  }

  bindEvent () {
    const handler = this.hashChangeHandler.bind(this)
    Taro['eventCenter'].on('routerChange', handler)
    this.removeEvent = () => {
      Taro['eventCenter'].off('routerChange', handler)
    }
  }

  handleSelect = (index, e) => {
    let list = this.state.list
    Taro.redirectTo && Taro.redirectTo({
      url: (/^\//.test(list[index].pagePath) ? '' : '/') + list[index].pagePath
    })
  }

  render () {
    const { conf } = this.props

    conf.borderStyle = conf.borderStyle || 'black'
    let containerCls = classNames('weui-tabbar', {
      [`taro-tabbar__border-${conf.borderStyle}`]: true
    })
    return (
      <div className='taro-tabbar__tabbar' style={{display: this.state.isShow ? '' : 'none'}}>
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
                onSelect={this.handleSelect}
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
