/**
 * ✔ onClick(tap)
 * ✔ onLongPress(longpress)
 * ✔ onTouchstart
 * ✔ onTouchmove
 * ✔ onTouchcancel
 * ✔ onTouchend
 *
 * @todo callback event parameters
 *
 * @flow
 */

import * as React from 'react'
import {
  View,
  // TouchableWithoutFeedback,
  StyleSheet,
  PanResponder,
} from 'react-native'
import { omit, dismemberStyle } from '../../utils'

type Props = {
  style?: StyleSheet.Styles,
  onClick?: Function,
  onLongPress?: Function,
  onTouchstart?: Function,
  onTouchmove?: Function,
  onTouchcancel?: Function,
  onTouchend?: Function,
}

export default function (WrappedComponent: React.ComponentType<*>) {
  return class _Clickable extends React.Component<Props> {
    // eslint-disable-next-line no-useless-constructor
    constructor (props: Props) {
      super(props)
    }

    props: Props
    startTimestamp: number = 0
    panResponder: any = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        const { onTouchstart, onTouchmove, onTouchcancel, onTouchend } = this.props
        return onTouchstart || onTouchmove || onTouchcancel || onTouchend
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { onTouchmove, onTouchcancel, onTouchend } = this.props
        return onTouchmove || onTouchcancel || onTouchend
      },
      onPanResponderGrant: (evt, gestureState) => {
        const { onTouchstart } = this.props
        onTouchstart && onTouchstart()
        this.startTimestamp = evt.nativeEvent.timestamp
      },
      onPanResponderMove: (evt, gestureState) => {
        const { onTouchmove } = this.props
        onTouchmove && onTouchmove()
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { onClick, onLongPress, onTouchend } = this.props
        onTouchend && onTouchend()
        const endTimestamp = evt.nativeEvent.timestamp
        const gapTime = endTimestamp - this.startTimestamp
        if (gapTime <= 350) {
          onClick && onClick()
        } else {
          onLongPress && onLongPress()
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        const { onTouchcancel } = this.props
        onTouchcancel && onTouchcancel()
      },
    })

    render () {
      const {
        style,
        onClick,
        onLongPress,
        onTouchstart,
        onTouchmove,
        onTouchcancel,
        onTouchend,
      } = this.props

      if (
        !onClick &&
        !onLongPress &&
        !onTouchstart &&
        !onTouchmove &&
        !onTouchcancel &&
        !onTouchend
      ) {
        return (
          <WrappedComponent {...this.props} />
        )
      }

      const dismember = dismemberStyle(style)

      return (
        <View
          {...this.panResponder.panHandlers}
          style={dismember.wrapperStyle}
        >
          <WrappedComponent
            {...omit(this.props, [
              'style',
              'onClick',
              'onLongPress',
              'onTouchstart',
              'onTouchmove',
              'onTouchcancel',
              'onTouchend'
            ])}
            style={dismember.innerStyle}
          />
        </View>
      )
    }
  }
}
