/**
 * ✔ value
 * ✔ disabled
 * ✔ checked
 * ✔ color
 * ✔ onChange
 *
 * @flow
 */

import * as React from 'react'
import {
  Picker,
  StyleSheet,
} from 'react-native'

type Props = {
  style?: StyleSheet.Styles
}
type State = {
  language: string
}

class _Picker extends React.Component<Props, State> {
  props: Props
  state: State = {
    language: ''
  }

  static defaultProps = {
  }

  render () {
    const {
      style,
    } = this.props

    return (
      <Picker
        selectedValue={this.state.language}
        style={{ width: 200 }}
        onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
    )
  }
}

export default _Picker
