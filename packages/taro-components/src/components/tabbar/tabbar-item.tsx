/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import classNames from 'classnames'
import { FunctionalComponent, h } from '@stencil/core'

type TabbarItemProps = {
  index: number
  isSelected?: boolean
  textColor?: string
  badgeText?: string
  iconPath: string
  showRedDot?: boolean
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
