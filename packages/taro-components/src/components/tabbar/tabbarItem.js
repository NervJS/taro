import Taro from '@tarojs/taro-h5'
import classNames from 'classnames'
import Nerv from 'nervjs'

const noop = () => {}

export default class Tabbar extends Taro.Component {
  static defaultProps = {
    index: null,
    isSelected: false,
    textColor: {},
    iconPath: '',
    onSelect: noop,
    badgeText: null,
    showRedDot: false
  }

  onClick = () => {
    this.props.onSelect(this.props.index)
  }

  render () {
    const { isSelected, index, textColor, iconPath, text, badgeText, showRedDot } = this.props
    const className = classNames('weui-tabbar__item', {
      'weui-bar__item_on': isSelected
    })
    const badgeStyle = {
      position: 'absolute',
      top: '-2px',
      right: '-13px'
    }
    const dotStyle = {
      position: 'absolute',
      top: 0,
      right: '-6px'
    }

    return (
      <a key={index} href='javascript:;' className={className} onClick={this.onClick}>
        <span style='display: inline-block;position: relative;'>
          <img src={iconPath} alt='' className='weui-tabbar__icon' />
          {badgeText &&
            <span
              className='weui-badge taro-tabbar-badge'
              style={badgeStyle}>
              {badgeText}
            </span>
          }
          {showRedDot &&
            <span
              className='weui-badge weui-badge_dot'
              style={dotStyle} />}
        </span>
        <p className='weui-tabbar__label' style={{ color: textColor }}>
          {text}
        </p>
      </a>
    )
  }
}
