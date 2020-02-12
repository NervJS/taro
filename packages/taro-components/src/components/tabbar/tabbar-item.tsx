import classNames from 'classnames'
import { h } from '@stencil/core'

export const TabbarItem = (props) => {
  const {
    index = null,
    isSelected = false,
    textColor = {},
    iconPath = '',
    badgeText = null,
    showRedDot = false,
    text
  } = props
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
    top: '0',
    right: '-6px'
  }

  function onClick () {
    props.onSelect(props.index)
  }

  return <a key={index} href='javascript:;' class={className} onClick={onClick}>
    <span style={{ display: 'inline-block', position: 'relative' }}>
      <img src={iconPath} alt='' class='weui-tabbar__icon' />
      {badgeText &&
      <span
        class='weui-badge taro-tabbar-badge'
        style={badgeStyle}>
        {badgeText}
      </span>
      }
      {showRedDot &&
      <span
        class='weui-badge weui-badge_dot'
        style={dotStyle}
      />}
    </span>
    <p class='weui-tabbar__label' style={{ color: textColor }}>
      {text}
    </p>
  </a>
}
