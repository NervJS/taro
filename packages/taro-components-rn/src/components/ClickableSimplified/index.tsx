/**
 * ✔ hoverStyle: Convert hoverClass to hoverStyle.
 * ✔ hoverStartTime
 * ✔ hoverStayTime
 * ✘ hoverStopPropagation: Fixed value TRUE
 * ✔ onClick(tap)
 * ✔ onLongPress(longpress)
 * ✔ onTouchstart
 * ✘ onTouchmove
 * ✘ onTouchcancel
 * ✔ onTouchend
 */

import * as React from 'react'
import {
  PanResponder,
  GestureResponderEvent,
} from 'react-native'
import { omit } from '../../utils'
import { ClickableProps } from './PropsType'

export default function (WrappedComponent: React.ComponentType<any>) {
  return class _Clickable extends React.Component<ClickableProps> {
    static defaultProps = {
      hoverStartTime: 20,
      hoverStayTime: 70
    }

    state: any = {
      isHover: false
    }

    startTimestamp: number = 0
    startTimer: any
    stayTimer: any

    panResponder: any = PanResponder.create({
      onStartShouldSetPanResponder: (evt: GestureResponderEvent, gestureState) => {
        const {
          hoverStyle,
          onClick,
          onLongPress,
          onTouchstart,
          // onTouchmove,
          // onTouchcancel,
          onTouchend
        } = this.props
        return !!(hoverStyle || onClick || onLongPress || onTouchstart || onTouchend)
      },
      onShouldBlockNativeResponder: () => false,
      // onMoveShouldSetPanResponder: (evt: GestureResponderEvent, gestureState) => {
      //   const { onTouchmove, onTouchcancel, onTouchend } = this.props
      //   return !!(onTouchmove || onTouchcancel || onTouchend)
      // },
      onPanResponderGrant: (evt: GestureResponderEvent, gestureState) => {
        const { onTouchstart } = this.props
        onTouchstart && onTouchstart(this.getWxAppEvent(evt))
        this.startTimestamp = evt.nativeEvent.timestamp
        this.setStartTimer()
      },
      // onPanResponderMove: (evt: GestureResponderEvent, gestureState) => {
      //   const { onTouchmove } = this.props
      //   onTouchmove && onTouchmove(this.getWxAppEvent(evt))
      // },
      onPanResponderTerminationRequest: (evt: GestureResponderEvent, gestureState) => true,
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState) => {
        const { onClick, onLongPress, onTouchend } = this.props
        onTouchend && onTouchend(this.getWxAppEvent(evt))
        const endTimestamp = evt.nativeEvent.timestamp
        const gapTime = endTimestamp - this.startTimestamp
        const hasMove = Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1
        if (!hasMove) {
          if (gapTime <= 350) {
            onClick && onClick(this.getWxAppEvent(evt))
          } else {
            onLongPress && onLongPress(this.getWxAppEvent(evt))
          }
        }
        this.setStayTimer()
      },
      onPanResponderTerminate: (evt: GestureResponderEvent, gestureState) => {
        // const { onTouchcancel } = this.props
        // onTouchcancel && onTouchcancel(this.getWxAppEvent(evt))
        this.setStayTimer()
      },
    })

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

    getWxAppEvent = (event: GestureResponderEvent) => {
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
        // onTouchmove,
        // onTouchcancel,
        onTouchend,
      } = this.props
      const { isHover } = this.state

      if (
        !hoverStyle &&
        // !hoverStopPropagation &&
        !onClick &&
        !onLongPress &&
        !onTouchstart &&
        // !onTouchmove &&
        // !onTouchcancel &&
        !onTouchend
      ) {
        return (
          <WrappedComponent {...this.props} />
        )
      }

      return (
        <WrappedComponent
          {...omit(this.props, [
            'style',
            'hoverStyle',
            'hoverStartTime',
            'hoverStayTime',
            'onClick',
            'onLongPress',
            'onTouchstart',
            // 'onTouchmove',
            // 'onTouchcancel',
            'onTouchend'
          ])}
          {...this.panResponder.panHandlers}
          style={[style, isHover && hoverStyle]}
        />
      )
    }
  }
}
