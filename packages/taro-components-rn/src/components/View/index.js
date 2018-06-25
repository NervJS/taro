/**
 * ✘ hover-class
 * ✘ hover-stop-propagation
 * ✘ hover-start-time
 * ✘ hover-stay-time
 *
 * @todo props.hoverClass needs transforming to Stylesheet.Styles
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
}

type State = {
  // hover: boolean,
}

class _View extends React.Component<Props, State> {
  props: Props
  timer: TimeoutID
  state = {
    // hover: false
  }

  render () {
    const {
      style,
      hoverClass,
    } = this.props
    const { hover } = this.state

    return (
      <View style={[style, hover && hoverClass]}>
        {this.props.children}
      </View>
    )
  }
}

export { _View }
export default Clickable(_View)
