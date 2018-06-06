/**
 * ✔ value
 * ✘ type: Partially.
 * ✔ password
 * ✔ placeholder
 * ✘ placeholder-style: Only placeholderTextColor(RN).
 * - placeholder-class
 * ✔ disabled
 * ✔ maxlength
 * ✘ cursor-spacing
 * - auto-focus
 * ✔ focus
 * ✘ confirm-type
 * ✘ confirm-hold
 * ✔ cursor
 * ✔ selectionStart(selection-start)
 * ✔ selectionEnd(selection-end)
 * ✘ adjust-position
 * ✘ onInput(bindinput): No cursor info.
 * ✘ onFocus(bindfocus)
 * ✘ onBlur(bindblur)
 * ✘ onConfirm(bindconfirm)
 *
 * @flow
 */

import * as React from 'react'
import {
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native'

const keyboardTypeMap = {
  text: 'default',
  number: 'numeric',
  idcard: 'default',
  digit: Platform.select({
    ios: 'decimal-pad',
    android: 'numeric'
  }),
}

type Props = {
  style?: StyleSheet.Styles,
  value?: string,
  type: 'text' | 'number' | 'idcard' | 'digit',
  password?: boolean,
  placeholder?: string,
  disabled?: boolean,
  maxlength: number,
  focus?: boolean,
  cursor?: number,
  selectionStart: number,
  selectionEnd: number,
  onInput?: Function,
}
type State = {
  value: string
}

class _Input extends React.Component<Props, State> {
  props: Props
  state: State = {
    value: ''
  }

  static defaultProps = {
    type: 'text',
    maxlength: 140,
    selectionStart: -1,
    selectionEnd: -1,
  }

  onChangeText = (text) => {
    const { onInput } = this.props
    if (onInput) {
      const result = onInput({ detail: { value: text } })
      if (result) {
        this.setState({ value: result })
      }
    }
  }

  render () {
    const {
      style,
      value,
      type,
      password,
      placeholder,
      disabled,
      maxlength,
      focus,
      cursor,
      selectionStart,
      selectionEnd,
    } = this.props

    const keyboardType = keyboardTypeMap[type]

    const selection = (() => {
      if (selectionStart >= 0 && selectionEnd >= 0) {
        return { start: selectionStart, end: selectionEnd }
      } else if (typeof cursor === 'number') {
        return { start: cursor, end: cursor }
      }
    })()

    return (
      <TextInput
        defaultValue={value}
        keyboardType={keyboardType}
        secureTextEntry={!!password}
        placeholder={placeholder}
        editable={!disabled}
        maxLength={maxlength}
        autoFocus={!!focus}
        selection={selection}
        onChangeText={this.onChangeText}
        value={this.state.value}
        style={style}
      />
    )
  }
}

export default _Input
