/**
 * ✔ value
 * ✔ disabled
 * ✔ checked
 * ✔ color
 *
 * @see https://wechat.design/brand/color
 *
 * @flow
 */

import * as React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import Icon from '../Icon'
import styles from './styles'

type Props = {
  style?: StyleSheet.Styles,
  onChange?: Function,
  value: string,
  disabled?: boolean,
  checked?: boolean,
  color: string | number
}
type State = {
  checked: boolean
}

class _Checkbox extends React.Component<Props, State> {
  props: Props

  static defaultProps = {
    value: '',
    color: '#09BB07',
  }

  state: State = {
    checked: !!this.props.checked
  }

  onPress= () => {
    const { disabled, onChange, value } = this.props

    if (disabled) return

    onChange && onChange({
      value,
      checked: !this.state.checked
    })

    this.setState({ checked: !this.state.checked })
  }

  render () {
    const {
      style,
      color,
    } = this.props

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={[styles.wrapper, style, this.state.checked && styles.wrapperChecked]}>
          <Icon
            type="success_no_circle"
            size={18}
            color={color}
            style={[styles.wrapperIcon, this.state.checked && styles.wrapperCheckedIcon]}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default _Checkbox
