/**
 * ✘ for
 *
 * @flow
 */

import * as React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native'

type Props = {
  children?: React.Node,
  style?: StyleSheet.Styles,
}

class _Label extends React.Component<Props> {
  props: Props
  hadFoundValidWidget: boolean = false
  $validWidget: any = null

  findValidWidget = (children: any) => {
    if (this.hadFoundValidWidget) return children

    return React.Children.toArray(children).map((child, index) => {
      if (!child.type) return child

      const childTypeName = child.type.name
      if (!this.hadFoundValidWidget &&
        (
          childTypeName === '_Checkbox' ||
          childTypeName === '_Button' ||
          childTypeName === '_Radio' ||
          childTypeName === '_Switch'
        )
      ) {
        this.hadFoundValidWidget = true
        return React.cloneElement(
          child,
          {
            ...child.props,
            ref: (vw) => { this.$validWidget = vw }
          },
          child.props.children
        )
      }
      return React.cloneElement(
        child,
        { ...child.props },
        this.findValidWidget(child.props.children)
      )
    })
  }

  onPress = () => {
    this.$validWidget && this.$validWidget._simulateNativePress()
  }

  render () {
    const {
      children,
      style,
    } = this.props

    const mapChildren = this.findValidWidget(children)
    // Prepare for next rerender
    this.hadFoundValidWidget = false

    return (
      <TouchableWithoutFeedback
        onPress={this.onPress}
      >
        <View
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onStartShouldSetResponderCapture={() => true}
          onMoveShouldSetResponderCapture={() => true}
          style={style}
        >
          {mapChildren}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default _Label
