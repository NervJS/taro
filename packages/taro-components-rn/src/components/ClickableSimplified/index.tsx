/**
 * ✔ hoverStyle: Convert hoverClass to hoverStyle.
 * ✔ hoverStartTime
 * ✔ hoverStayTime
 * ✘ hoverStopPropagation: Fixed value TRUE
 * ✔ onClick(tap)
 * ✔ onLongPress(longpress)
 * ✔ onTouchStart
 * ✘ onTouchMove
 * ✘ onTouchCancel
 * ✔ onTouchEnd
 */

import * as React from 'react'
import {
  PanResponder,
  GestureResponderEvent,
} from 'react-native'
import { omit } from '../../utils'
import { ClickableProps } from './PropsType'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function <P extends Record<string, any>>(WrappedComponent: React.ComponentType<P>) {
  return class _Clickable extends React.Component<P & ClickableProps> {
    static defaultProps = {
      hoverStartTime: 20,
      hoverStayTime: 70
    }

    state: any = {
      isHover: false
    }

    startTimestamp = 0
    startTimer: any
    stayTimer: any

    panResponder: any = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        const {
          hoverStyle,
          onClick,
          onLongPress,
          onTouchStart,
          // onTouchMove,
          // onTouchCancel,
          onTouchEnd
        } = this.props
        return !!(hoverStyle || onClick || onLongPress || onTouchStart || onTouchEnd)
      },
      onShouldBlockNativeResponder: () => false,
      // onMoveShouldSetPanResponder: (evt: GestureResponderEvent, gestureState) => {
      //   const { onTouchMove, onTouchCancel, onTouchEnd } = this.props
      //   return !!(onTouchMove || onTouchCancel || onTouchEnd)
      // },
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { onTouchStart } = this.props
        onTouchStart && onTouchStart(this.getWxAppEvent(evt))
        this.startTimestamp = evt.nativeEvent.timestamp
        this.setStartTimer()
      },
      // onPanResponderMove: (evt: GestureResponderEvent, gestureState) => {
      //   const { onTouchMove } = this.props
      //   onTouchMove && onTouchMove(this.getWxAppEvent(evt))
      // },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState) => {
        const { onClick, onLongPress, onTouchEnd } = this.props
        onTouchEnd && onTouchEnd(this.getWxAppEvent(evt))
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
      onPanResponderTerminate: () => {
        // const { onTouchCancel } = this.props
        // onTouchCancel && onTouchCancel(this.getWxAppEvent(evt))
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
        onTouchStart,
        // onTouchMove,
        // onTouchCancel,
        onTouchEnd,
      } = this.props
      const { isHover } = this.state

      if (
        !hoverStyle &&
        // !hoverStopPropagation &&
        !onClick &&
        !onLongPress &&
        !onTouchStart &&
        // !onTouchMove &&
        // !onTouchCancel &&
        !onTouchEnd
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
            'onTouchStart',
            // 'onTouchMove',
            // 'onTouchCancel',
            'onTouchEnd'
          ])}
          {...this.panResponder.panHandlers}
          style={[style, isHover && hoverStyle]}
        />
      )
    }
  }
}
