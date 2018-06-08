import Nerv from 'nervjs'
import classNames from 'classnames'
import './style'
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
    list[0].selected = true
    this.state = {
      list,
      isShow: true,
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

  hashChangeHandler () {
    const hash = location.hash
    if (!hash) return
    const len = this.state.list.length
    for (let i = 0; i < len; i++) {
      if (this.state.list[i].pagePath.indexOf(hash.replace(/^#\//, '')) > -1) {
        return this.setState({
          isShow: true,
          selectedIndex: i
        })
      }
    }
    this.setState({
      isShow: false
    })
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
    window.addEventListener('hashchange', this.hashChangeHandler.bind(this))
  }

  removeEvent () {
    window.removeEventListener('hashchange', this.hashChangeHandler.bind(this))
  }

  render () {
    const { conf, router = {} } = this.props
    function handleSelect (index, e) {
      let list = this.state.list
      router.navigateTo &&
        router.navigateTo({
          url:
            (/^\//.test(list[index].pagePath) ? '' : '/') + list[index].pagePath
        })
    }
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
            const cls = classNames('weui-tabbar__item', {
              [`weui-bar__item_on`]: this.state.selectedIndex === index
            })
            let textStyle = {
              color: this.state.selectedIndex === index ? conf.selectedColor : conf.color || ''
            }
            return (
              <a
                key={index}
                href='javascript:;'
                className={cls}
                onClick={handleSelect.bind(this, index)}
              >
                <span style='display: inline-block;position: relative;'>
                  <img
                    src={this.state.selectedIndex === index ? item.selectedIconPath : item.iconPath}
                    alt=''
                    className='weui-tabbar__icon'
                  />
                </span>
                <p className='weui-tabbar__label' style={textStyle}>
                  {item.text}
                </p>
              </a>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Tabbar
