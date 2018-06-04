/**
 * @flow
 */

import * as React from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'

type Props = {
  children?: React.Node,
  style?: StyleSheet.Styles,
  onChange?: Function,
}
type State = {
  checkedValue: ?string
}

class _RadioGroup extends React.Component<Props, State> {
  props: Props
  state: State = {
    checkedValue: null
  }

  onValueChange = (radioOnChangeFn: ?Function, e: { value: * }) => {
    this.setState({ checkedValue: e.value })
    radioOnChangeFn && radioOnChangeFn()
  }

  render () {
    const {
      children,
      style,
    } = this.props
    const { checkedValue } = this.state

    const mapChildren = React.Children.toArray(children).map((child) => {
      if (child.type.name === '_Radio') {
        return React.cloneElement(child, {
          ...child.props,
          checked: checkedValue === child.props.value,
          onChange: this.onValueChange.bind(this, child.props.onChange)
        })
      }
      return child
    })

    return (
      <View style={style}>
        {mapChildren}
      </View>
    )
  }
}

export default _RadioGroup
