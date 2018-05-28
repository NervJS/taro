/**
 * ✔ hover-class
 * ? hover-stop-propagation
 * ✔ hover-start-time
 * ✔ hover-stay-time
 *
 * @todo props.hoverClass needs transforming to Stylesheet.Styles
 *
 * ✔ touchstart
 * ✘ touchmove
 * ✘ touchcancel
 * ✔ touchend
 * ✔ tap
 * ✔ longpress
 * ✘ longtap (deprecated, recommended to use longpress)
 * ✘ transitionend
 * ✘ animationstart
 * ✘ animationiteration
 * ✘ animationend
 * ✘ touchforcechange
 *
 * @warn unstable
 *
 * @flow
 */

import React, { Component } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native'

type Props = {
  style?: StyleSheet.Styles,
  children?: any,
  hoverClass?: StyleSheet.Styles,
  hoverStopPropagation?: boolean,
  hoverStartTime?: number,
  hoverStayTime?: number,
  onTouchStart?: Function,
  onTouchMove?: Function,
  onTouchCancel?: Function,
  onTouchEnd?: Function,
  onTap?: Function,
  onLongPress?: Function,
  // onLongtap?: Function,
  // onTransitionend?: Function,
  // onAnimationstart?: Function,
  // onAnimationiteration?: Function,
  // onAnimationend?: Function,
  // onTouchforcechange?: Function,
}

type State = {
  hover: boolean,
}

class _View extends Component<Props, State> {
  timer: TimeoutID
  state = {
    hover: false
  }

  onPress = (event: Object) => {
    const { onTap } = this.props
    onTap && onTap(event)
  }

  onPressIn = (event: Object) => {
    const { onTouchStart } = this.props
    onTouchStart && onTouchStart(event)
    this.setState({ hover: true })
  }

  onPressOut = (event: Object) => {
    const { onTouchEnd } = this.props
    onTouchEnd && onTouchEnd(event)
    this.timer = setTimeout(() => {
      this.setState({ hover: true })
    }, this.props.hoverStayTime || 400)
  }

  onLongPress = (event: Object) => {
    const { onLongPress } = this.props
    onLongPress && onLongPress(event)
  }

  componentWillUnmount () {
    this.timer && clearTimeout(this.timer)
  }

  render () {
    const {
      style,
      hoverClass,
      hoverStopPropagation,
      hoverStartTime = 50,
      // hoverStayTime = 400,
      // onTouchStart,
      // onTouchEnd,
    } = this.props
    const { hover } = this.state

    const shouldNotSetResponder = !!hoverStopPropagation

    return (
      <View
        onStartShouldSetResponder={() => shouldNotSetResponder}
        onMoveShouldSetResponder={() => shouldNotSetResponder}
        style={[style, hover && hoverClass]}
      >
        <TouchableWithoutFeedback
          delayPressIn={hoverStartTime}
          onPress={this.onPress}
          onPressIn={this.onPressIn}
          onPressOut={this.onPressOut}
          onLongPress={this.onLongPress}
          delayLongPress={350}
        >
          <View>
            {this.props.children}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

export default _View
