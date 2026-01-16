/**
 * 半受控组件
 *
 * ✔ value
 * ✔ disabled
 * ✔ checked
 * ✔ color
 * ✔ onChange
 */

import * as React from 'react'

import { noop } from '../../utils'
import Icon from '../Icon'
import View from '../View'
import { RadioProps, RadioState } from './PropsType'
import styles from './styles'

class _Radio extends React.Component<RadioProps, RadioState> {
  static displayName = '_Radio'
  static defaultProps = {
    value: '',
    color: '#09BB07'
  }

  static getDerivedStateFromProps(props: RadioProps, state: RadioState): RadioState | null {
    return props.checked !== state.checked
      ? {
        checked: !!props.checked
      }
      : null
  }

  state: RadioState = {
    checked: false
  }

  _simulateNativePress = (): void => {
    this.onPress()
  }

  onPress = (): void => {
    const { disabled, onChange = noop, value } = this.props

    if (disabled) return

    if (this.state.checked) return

    onChange({
      value,
      checked: !this.state.checked
    })

    this.setState({ checked: !this.state.checked })
  }

  render(): JSX.Element {
    const { style, color } = this.props

    const isChecked: boolean = this.state.checked

    return (
      <View style={styles.container} onClick={this.onPress}>
        <View
          style={[styles.wrapper, isChecked && styles.wrapperChecked, isChecked && { borderColor: color }, style]}
        >
          <Icon
            type="success"
            size={24}
            color={color}
            style={[styles.wrapperIcon, isChecked && styles.wrapperCheckedIcon]}
          />
        </View>
        <View style={{ flexGrow: 0 }}>
          {this.props.children}
        </View>
      </View>
    )
  }
}

export default _Radio
