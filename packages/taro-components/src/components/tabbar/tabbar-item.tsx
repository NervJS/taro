/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

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
