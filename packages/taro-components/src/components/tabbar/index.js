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
      list
    }
  }

  render () {
    const { conf, router = {} } = this.props
    function handleSelect (index, e) {
      let list = this.state.list
      list.forEach((item, i) => {
        if (i === index) {
          item.selected = true
        } else {
          item.selected = false
        }
      })
      this.setState({
        list
      })
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
      <div
        className={containerCls}
        style={{
          position: 'fixed',
          backgroundColor: conf.backgroundColor || ''
        }}
      >
        {this.state.list.map((item, index) => {
          const cls = classNames('weui-tabbar__item', {
            [`weui-bar__item_on`]: item.selected
          })
          let textStyle = {
            color: item.selected ? conf.selectedColor : conf.color || ''
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
                  src={item.selected ? item.selectedIconPath : item.iconPath}
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
    )
  }
}

export default Tabbar
