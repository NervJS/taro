/**
 * @flow
 */

import * as React from 'react'
import {
  // Text,
  // View,
  StyleSheet,
} from 'react-native'
import View from '../View'
import styles from './styles'
import utils from '../../utils'

type Props = {
  children?: React.Node,
  style?: StyleSheet.Styles
}

class _SwiperItem extends React.Component<Props> {
  props: Props

  /**
   * e, state, context(ref to swiper's this)
   */
  onMomentumScrollEnd = (e: any, state: { index: number }) => {
    const { onAnimationFinish } = this.props
    onAnimationFinish && onAnimationFinish({ detail: { current: state.index } })
  }

  render () {
    const {
      children,
      style
    } = this.props

    return (
      <View
        {...utils.omit(this.props, ['style'])}
        style={[styles.page, style]}
      >
        {children}
      </View>
    )
  }
}

export default _SwiperItem
