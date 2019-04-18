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
  View,
  TouchableWithoutFeedback
} from 'react-native'
import { omit, noop } from '../../utils'
import { ClickableProps, TouchableEvent } from './PropsType'

const getWxAppEvent = (event: TouchableEvent) => {
  const nativeEvent = event.nativeEvent || {}
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

export default function ClickableSimplified (WrappedComponent: React.ComponentType<ClickableProps>) {
  return class extends React.Component<ClickableProps, any> {
    static defaultProps = {
      hoverStartTime: 20,
      hoverStayTime: 70
    }

    state: any = {
      isHover: false
    }

    onPress = (evt: TouchableEvent) => {
      const { onClick = noop } = this.props
      onClick(getWxAppEvent(evt))
    }

    onLongPress = (evt: TouchableEvent) => {
      const { onLongPress = noop } = this.props
      onLongPress(getWxAppEvent(evt))
    }

    onPressIn = (evt: TouchableEvent) => {
      const { onTouchstart = noop } = this.props
      onTouchstart(getWxAppEvent(evt))
      this.setState({ isHover: true })
    }

    onPressOut = (evt: TouchableEvent) => {
      const { onTouchend = noop } = this.props
      onTouchend(getWxAppEvent(evt))
      this.setState({ isHover: false })
    }

    render () {
      const {
        style,
        hoverStyle,
        hoverStartTime,
        hoverStayTime,
        onClick,
        onLongPress,
        onTouchstart,
        onTouchend
      } = this.props

      if (!onClick && !onLongPress && !onTouchstart && !onTouchend) {
        return (
          <WrappedComponent {...this.props} />
        )
      }

      return (
        <TouchableWithoutFeedback
          delayPressIn={hoverStartTime}
          delayPressOut={hoverStayTime}
          onPress={this.onPress}
          onLongPress={this.onLongPress}
          onPressIn={this.onPressIn}
          onPressOut={this.onPressOut}
        >
          <View>
            <WrappedComponent
              {...omit(this.props, [
                'style',
                'hoverStyle',
                'hoverStartTime',
                'hoverStayTime',
                'onClick',
                'onLongPress',
                'onTouchstart',
                'onTouchend'
              ])}
              style={[
                style,
                this.state.isHover && hoverStyle
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
      )
    }
  }
}
