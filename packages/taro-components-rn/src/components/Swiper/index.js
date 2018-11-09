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
 * @warn vertical swiper nested in scrollview on android would not work.
 *
 * @example
 * <Swiper
 *   showsPagination={true}
 *   indicatorColor="white"
 *   indicatorActiveColor="purple"
 *   autoplay={false}
 *   current={1}
 *   interval={6000}
 *   circular={false}
 *   vertical={true}
 *   onChange={() => null}
 *   onAnimationFinish={() => null}
 *   style={{ backgroundColor: 'black' }}
 * >
 *   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red' }}>
 *     <Text style={styles.text}>Hello Swiper</Text>
 *   </View>
 *   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green' }}>
 *     <Text style={styles.text}>Beautiful</Text>
 *   </View>
 *   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'blue' }}>
 *     <Text style={styles.text}>And simple</Text>
 *   </View>
 * </Swiper>
 *
 * @flow
 */

import * as React from 'react'
import {
  // Text,
  // View,
  StyleSheet,
} from 'react-native'
import Swiper from '@nart/react-native-swiper'
// import styles from './styles'

type Props = {
  children?: React.Node,
  style?: StyleSheet.Styles,
  indicatorDots?: boolean,
  indicatorColor: string | number,
  indicatorActiveColor: string | number,
  autoplay?: boolean,
  current: number,
  interval: number,
  circular?: boolean,
  vertical?: boolean,
  onChange?: Function,
  onAnimationFinish?: Function,
}

class _Swiper extends React.Component<Props> {
  props: Props

  static defaultProps = {
    indicatorColor: 'rgba(0,0,0,0.3)',
    indicatorActiveColor: '#000',
    current: 0,
    interval: 5000,
  }

  onIndexChanged = (index: number) => {
    const { onChange } = this.props
    onChange && onChange({ detail: { current: index } })
  }

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

    const styleHeight = style.height
    delete style.height

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
        height={styleHeight}
        style={style}
      >
        {children}
      </Swiper>
    )
  }
}

export default _Swiper
