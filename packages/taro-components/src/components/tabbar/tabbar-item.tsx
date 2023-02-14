import classNames from 'classnames'
import { FunctionalComponent, h } from '@stencil/core'
import Taro from '@tarojs/taro'

import { isVisible } from '../../utils'

type TabbarItemProps = {
  index: number
  isSelected?: boolean
  textColor?: string
  badgeText?: string
  iconPath: string
  showRedDot?: boolean
  pagePath?: string
  text?: string
  onSelect: (index: number) => void
}

export const TabbarItem: FunctionalComponent<TabbarItemProps> = ({
  index,
  isSelected = false,
  textColor,
  iconPath,
  badgeText,
  showRedDot = false,
  pagePath,
  text,
  onSelect
}) => {
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
    const page = Taro.getCurrentPages().shift()
    if (typeof page?.onTabItemTap === 'function' && isVisible(this)) {
      page.onTabItemTap({ index, pagePath, text })
    }
    onSelect(index)
  }

  return (
    <a key={index} href='javascript:;' class={className} onClick={onClick}>
      <span style={{ display: 'inline-block', position: 'relative' }}>
        <img src={iconPath} alt='' class='weui-tabbar__icon' />
        {!!badgeText && (
          <span
            class='weui-badge taro-tabbar-badge'
            style={badgeStyle}>
            {badgeText}
          </span>
        )}
        {showRedDot && (
          <span
            class='weui-badge weui-badge_dot'
            style={dotStyle}
          />
        )}
      </span>
      <p class='weui-tabbar__label' style={{ color: textColor }}>
        {text}
      </p>
    </a>
  )
}
