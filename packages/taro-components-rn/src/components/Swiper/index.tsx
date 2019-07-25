/**
 * 注意事项：
 *   Swiper 不能加 `flex: 1`
 *
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
 *   indicatorDots={true}
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
 */

import * as React from 'react'
import {
  StyleSheet,
  ViewStyle
} from 'react-native'
// import Swiper from 'react-native-swiper'
import Swiper from '@manjiz/react-native-swiper'
import { noop } from '../../utils'
import { SwiperProps } from './PropsType'

class _Swiper extends React.Component<SwiperProps> {
  static defaultProps = {
    indicatorColor: 'rgba(0,0,0,0.3)',
    indicatorActiveColor: '#000',
    current: 0,
    interval: 5000,
  }

  onIndexChanged = (index: number): void => {
    const { onChange = noop } = this.props
    onChange({ detail: { current: index } })
  }

  /**
   * e, state, context(ref to swiper's this)
   */
  onMomentumScrollEnd = (e: any, state: { index: number }): void => {
    const { onAnimationFinish = noop } = this.props
    onAnimationFinish({ detail: { current: state.index } })
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

    // 从样式中取出部分常用样式
    let formattedStyle: ViewStyle | undefined
    const containerStyle: { [key: string]: any } = {}
    if (style) {
      const flattenStyle: ViewStyle = StyleSheet.flatten(style)
      if (flattenStyle) {
        for (let key in flattenStyle) {
          if (/width|height|margin.*/.test(key)) {
            containerStyle[key] = flattenStyle[key as keyof ViewStyle]
            delete flattenStyle[key as keyof ViewStyle]
          }
        }
        if (containerStyle.width || containerStyle.height) {
          containerStyle.flex = 0
        }
        formattedStyle = flattenStyle
      }
    }

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
        containerStyle={containerStyle}
        style={formattedStyle || style}
      >
        {children}
      </Swiper>
    )
  }
}

export default _Swiper
