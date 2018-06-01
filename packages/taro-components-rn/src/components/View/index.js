/**
 * ✘ hover-class
 * ✘ hover-stop-propagation
 * ✘ hover-start-time
 * ✘ hover-stay-time
 *
 * @todo props.hoverClass needs transforming to Stylesheet.Styles
 *
 * ✘ touchstart
 * ✘ touchmove
 * ✘ touchcancel
 * ✘ touchend
 * ✔ onClick(tap)
 * ✘ longpress
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

import * as React from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'
import Clickable from '../_Clickable'

type Props = {
  style?: StyleSheet.Styles,
  children?: React.Node,
  hoverClass?: StyleSheet.Styles,
  hoverStopPropagation?: boolean,
  hoverStartTime?: number,
  hoverStayTime?: number,
  onTouchStart?: Function,
  onTouchMove?: Function,
  onTouchCancel?: Function,
  onTouchEnd?: Function,
  onClick?: Function,
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

class _View extends React.Component<Props, State> {
  props: Props
  timer: TimeoutID
  state = {
    hover: false
  }

  onPress = (event: Object) => {
    const { onClick } = this.props
    onClick && onClick(event)
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
      // hoverStopPropagation,
      // hoverStartTime = 50,
      // hoverStayTime = 400,
      // onTouchStart,
      // onTouchEnd,
    } = this.props
    const { hover } = this.state

    // const shouldNotSetResponder = !!hoverStopPropagation

    return (
      <View style={[style, hover && hoverClass]}>
        {this.props.children}
      </View>
    )
  }
}

export default Clickable(_View)
