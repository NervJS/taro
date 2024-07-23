/**
 * SwiperItem
 */

import * as React from 'react'

import { omit } from '../../utils'
import View from '../View'
import { SwiperItemProps } from './PropsType'
import styles from './styles'

const _SwiperItem: React.FC<SwiperItemProps> = (props) => {
  const { children, style } = props
  return (
    <View
      {...omit(props, ['style'])}
      style={[styles.page, style]}
    >
      {children}
    </View>
  )
}

_SwiperItem.displayName = '_SwiperItem'

export default _SwiperItem
