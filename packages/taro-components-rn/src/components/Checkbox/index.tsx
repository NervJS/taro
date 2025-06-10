/**
 * 半受控组件
 *
 * ✔ value
 * ✔ disabled
 * ✔ checked
 * ✔ color
 * ✔ onChange
 *
 * @see https://wechat.design/brand/color
 */

import * as React from 'react'

import { noop } from '../../utils'
import Icon from '../Icon'
import View from '../View'
import { CheckboxProps, CheckboxState } from './PropsType'
import styles from './styles'

class _Checkbox extends React.Component<CheckboxProps, CheckboxState> {
  static displayName = '_Checkbox'
  static defaultProps = {
    value: '',
    color: '#09BB07'
  }

  static getDerivedStateFromProps(props: CheckboxProps, state: CheckboxState): CheckboxState | null {
    return props.checked !== state.checked
      ? {
        checked: !!props.checked
      }
      : null
  }

  state: CheckboxState = {
    checked: false,
  }

  _simulateNativePress = (): void => {
    this.onPress()
  }

  onPress = (): void => {
    const { disabled, onChange = noop, value } = this.props
    if (disabled) return
    const checked = !this.state.checked
    onChange({
      value,
      checked
    })

    this.setState({ checked })
  }

  render(): JSX.Element {
    const { style, color } = this.props
    const { checked } = this.state

    return (
      <View style={styles.container} onClick={this.onPress}>
        <View style={[styles.wrapper, style, checked && styles.wrapperChecked]}>
          <Icon
            type="success_no_circle"
            size={18}
            color={color}
            style={[styles.wrapperIcon, checked && styles.wrapperCheckedIcon]}
          />
        </View>
        <View style={{ flexGrow: 0 }}>
          {this.props.children}
        </View>
      </View>
    )
  }
}

export default _Checkbox
