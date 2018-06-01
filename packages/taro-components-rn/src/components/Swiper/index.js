/**
 * ✔ indicatorDots(indicator-dots)
 * ✔ indicatorColor(indicator-color)
 * ✔ indicatorActiveColor(indicator-active-color)
 * ✔ autoplay
 * ✔ current
 * ✘ currentItemId(current-item-id)
 * ✔ interval
 * ✘ duration
 * ✔ circular
 * ✔ vertical
 * ✘ previousMargin(previous-margin)
 * ✘ nextMargin(next-margin)
 * ✘ displayMultipleItems(display-multiple-items)
 * ✘ skipHiddenItem-layout(skip-hidden-item-layout)
 * ✔ onChange(bindchange): No support for detail.source
 * ✔ onAnimationFinish(bindanimationfinish): No support for detail.source
 *
 * @flow
 */

import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
} from 'react-native'
import Swiper from 'react-native-swiper'
import styles from './styles'

type Props = {
  children?: React.Node,
  style?: StyleSheet.Styles,
  indicatorDots?: boolean,
  indicatorColor?: string,
  indicatorActiveColor?: string,
  autoplay?: boolean,
  current?: number,
  interval?: number,
  circular?: boolean,
  vertical?: boolean,
  onChange?: Function,
  onAnimationFinish?: Function,
}

class _Swiper extends Component<Props> {
  props: Props

  static defaultProps = {
    indicatorColor: 'rgba(0,0,0,0.3)',
    indicatorActiveColor: '#000',
    current: 0,
    interval: 5000,
  }

  onIndexChanged = (index) => {
    const { onChange } = this.props
    onChange && onChange({ detail: { current: index } })
  }

  /**
   * e, state, context(ref to swiper's this)
   */
  onMomentumScrollEnd = (e, state) => {
    const { onAnimationFinish } = this.props
    onAnimationFinish && onAnimationFinish({ detail: { current: state.index } })
  }

  render () {
    const {
      children,
      style,
      indicatorDots,
      indicatorColor,
      indicatorActiveColor,
      autoplay,
      current,
      interval,
      circular,
      vertical,
    } = this.props

    return (
      <Swiper
        showsPagination={!!indicatorDots}
        dotColor={indicatorColor}
        activeDotColor={indicatorActiveColor}
        autoplay={!!autoplay}
        index={current}
        autoplayTimeout={parseFloat((interval / 1000).toFixed(1))}
        loop={!!circular}
        horizontal={!vertical}
        onIndexChanged={this.onIndexChanged}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
        style={style}
      >
        {children}
      </Swiper>
    )
  }
}

export default _Swiper
