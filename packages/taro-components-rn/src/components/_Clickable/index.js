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
        onTouchstart && onTouchstart(this.getWxAppEvent(evt))
        this.startTimestamp = evt.nativeEvent.timestamp
      },
      onPanResponderMove: (evt, gestureState) => {
        const { onTouchmove } = this.props
        onTouchmove && onTouchmove(this.getWxAppEvent(evt))
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { onClick, onLongPress, onTouchend } = this.props
        onTouchend && onTouchend(this.getWxAppEvent(evt))
        const endTimestamp = evt.nativeEvent.timestamp
        const gapTime = endTimestamp - this.startTimestamp
        if (gapTime <= 350) {
          onClick && onClick(this.getWxAppEvent(evt))
        } else {
          onLongPress && onLongPress(this.getWxAppEvent(evt))
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        const { onTouchcancel } = this.props
        onTouchcancel && onTouchcancel(this.getWxAppEvent(evt))
      },
    })

    getWxAppEvent = (event: Object) => {
      const nativeEvent = event.nativeEvent
      const { timestamp, target, pageX, pageY, touches = [], changedTouches = [] } = nativeEvent
      return {
        type: 'tap',
        timeStamp: timestamp,
        target: {
          id: target,
          dataset: {}
        },
        currentTarget: {
          id: target,
          dataset: {}
        },
        detail: {
          x: pageX,
          y: pageY
        },
        touches: touches.map((item) => {
          return {
            identifier: item.identifier,
            pageX: item.pageX,
            pageY: item.pageY,
            clientX: item.locationX,
            clientY: item.locationY
          }
        }),
        changedTouches: changedTouches.map((item) => {
          return {
            identifier: item.identifier,
            pageX: item.pageX,
            pageY: item.pageY,
            clientX: item.locationX,
            clientY: item.locationY
          }
        })
      }
    }

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
