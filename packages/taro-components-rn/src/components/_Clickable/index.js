/**
 * ✔ hoverStyle: Convert hoverClass to hoverStyle.
 * ✔ hoverStartTime
 * ✔ hoverStayTime
 * ✘ hoverStopPropagation: Fixed value TRUE
 * ✔ onClick(tap)
 * ✔ onLongPress(longpress)
 * ✔ onTouchstart
 * ✔ onTouchmove
 * ✔ onTouchcancel
 * ✔ onTouchend
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
  hoverStyle?: StyleSheet.Styles,
  hoverStartTime: number,
  hoverStayTime: number,
  // hoverStopPropagation?: boolean,
  onClick?: Function,
  onLongPress?: Function,
  onTouchstart?: Function,
  onTouchmove?: Function,
  onTouchcancel?: Function,
  onTouchend?: Function,
}

type State = {
  isHover: boolean
}

export default function (WrappedComponent: React.ComponentType<*>) {
  return class _Clickable extends React.Component<Props, State> {
    // eslint-disable-next-line no-useless-constructor
    constructor (props: Props) {
      super(props)
    }

    props: Props
    state: State = {
      isHover: false
    }
    startTimestamp: number = 0
    startTimer: TimeoutID
    stayTimer: TimeoutID

    panResponder: any = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        const {
          hoverStyle,
          onClick,
          onLongPress,
          onTouchstart,
          onTouchmove,
          onTouchcancel,
          onTouchend
        } = this.props
        return hoverStyle || onClick || onLongPress || onTouchstart || onTouchmove || onTouchcancel || onTouchend
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { onTouchmove, onTouchcancel, onTouchend } = this.props
        return onTouchmove || onTouchcancel || onTouchend
      },
      onPanResponderGrant: (evt, gestureState) => {
        const { onTouchstart } = this.props
        onTouchstart && onTouchstart(this.getWxAppEvent(evt))
        this.startTimestamp = evt.nativeEvent.timestamp
        this.setStartTimer()
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
        this.setStayTimer()
      },
      onPanResponderTerminate: (evt, gestureState) => {
        const { onTouchcancel } = this.props
        onTouchcancel && onTouchcancel(this.getWxAppEvent(evt))
        this.setStayTimer()
      },
    })

    static defaultProps = {
      hoverStartTime: 20,
      hoverStayTime: 70
    }

    setStartTimer = () => {
      const { hoverStyle, hoverStartTime } = this.props
      if (hoverStyle) {
        this.startTimer && clearTimeout(this.startTimer)
        this.startTimer = setTimeout(() => {
          this.setState({ isHover: true })
        }, hoverStartTime)
      }
    }

    setStayTimer = () => {
      const { hoverStyle, hoverStayTime } = this.props
      this.startTimer && clearTimeout(this.startTimer)
      if (hoverStyle) {
        this.stayTimer && clearTimeout(this.stayTimer)
        this.stayTimer = setTimeout(() => {
          this.startTimer && clearTimeout(this.startTimer)
          this.state.isHover && this.setState({ isHover: false })
        }, hoverStayTime)
      }
    }

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

    componentWillUnmount () {
      this.startTimer && clearTimeout(this.startTimer)
      this.stayTimer && clearTimeout(this.stayTimer)
    }

    render () {
      const {
        style,
        hoverStyle,
        // hoverStopPropagation,
        onClick,
        onLongPress,
        onTouchstart,
        onTouchmove,
        onTouchcancel,
        onTouchend,
      } = this.props
      const { isHover } = this.state

      if (
        !hoverStyle &&
        // !hoverStopPropagation &&
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
      const hoverStyleDismember = isHover ? dismemberStyle(hoverStyle) : {}

      return (
        <View
          {...this.panResponder.panHandlers}
          style={[dismember.wrapperStyle, hoverStyleDismember.wrapperStyle]}
        >
          <WrappedComponent
            {...omit(this.props, [
              'style',
              'hoverStyle',
              'hoverStartTime',
              'hoverStayTime',
              'onClick',
              'onLongPress',
              'onTouchstart',
              'onTouchmove',
              'onTouchcancel',
              'onTouchend'
            ])}
            style={[dismember.innerStyle, hoverStyleDismember.innerStyle]}
          />
        </View>
      )
    }
  }
}
