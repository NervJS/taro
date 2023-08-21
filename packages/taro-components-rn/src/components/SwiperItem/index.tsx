/**
 * SwiperItem
 */

import * as React from 'react'
import View from '../View'
import styles from './styles'
import { omit } from '../../utils'
import { SwiperItemProps } from './PropsType'

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
