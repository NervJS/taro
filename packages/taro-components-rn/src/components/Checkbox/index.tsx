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
import { TouchableWithoutFeedback, GestureResponderEvent } from 'react-native'
import Icon from '../Icon'
import View from '../View'
import styles from './styles'
import { noop } from '../../utils'
import { CheckboxProps, CheckboxState } from './PropsType'

class _Checkbox extends React.Component<CheckboxProps, CheckboxState> {
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

  $touchable = React.createRef<TouchableWithoutFeedback>()

  state: CheckboxState = {
    checked: false
  }

  _simulateNativePress = (evt: GestureResponderEvent): void => {
    const node = this.$touchable.current
    node && node.props.onPress && node.props.onPress(evt)
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
      <TouchableWithoutFeedback onPress={this.onPress} ref={this.$touchable}>
        <View style={styles.container}>
          <View style={[styles.wrapper, style, checked && styles.wrapperChecked]}>
            <Icon
              type="success_no_circle"
              size={18}
              color={color}
              style={[styles.wrapperIcon, checked && styles.wrapperCheckedIcon]}
            />
          </View>
          {this.props.children}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default _Checkbox
