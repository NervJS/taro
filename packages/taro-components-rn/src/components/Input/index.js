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
 * ✔ confirmType(confirm-type): Android only.
 * ✔ confirmHold(confirm-hold)
 * ✔ cursor
 * ✔ selectionStart(selection-start)
 * ✔ selectionEnd(selection-end)
 * ✘ adjust-position
 * ✔ onInput(bindinput): No CURSOR info.
 * ✔ onFocus(bindfocus): No HEIGHT info.
 * ✔ onBlur(bindblur)
 * ✔ onConfirm(bindconfirm)
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

// const confirmTypeMap = {
//   done: '完成',
//   send: '发送',
//   search: '搜索',
//   next: '下一个',
//   go: '前往',
// }

type Props = {
  style?: StyleSheet.Styles,
  value?: string,
  type: 'text' | 'number' | 'idcard' | 'digit',
  password?: boolean,
  placeholder?: string,
  disabled?: boolean,
  maxlength: number,
  focus?: boolean,
  confirmType: 'done' | 'send' | 'search' | 'next' | 'go',
  confirmHold?: boolean,
  cursor?: number,
  selectionStart: number,
  selectionEnd: number,
  onInput?: Function,
  onFocus?: Function,
  onBlur?: Function,
  onConfirm?: Function,
}
type State = {
  value: string
}

class _Input extends React.Component<Props, State> {
  // eslint-disable-next-line no-useless-constructor
  constructor (props: Props) {
    super(props)
  }

  props: Props
  state: State = {
    value: this.props.value || ''
  }

  static defaultProps = {
    type: 'text',
    maxlength: 140,
    confirmType: 'done',
    selectionStart: -1,
    selectionEnd: -1,
  }

  onChangeText = (text) => {
    const { onInput } = this.props
    if (onInput) {
      const result = onInput({ detail: { value: text } })
      this.setState({ value: typeof result === 'string' ? result : text })
    }
  }

  onFocus = () => {
    const { onFocus } = this.props
    event.detail = { value, height }
    onFocus && onFocus({ detail: { value: this.state.value } })
  }

  onBlur = () => {
    const { onBlur } = this.props
    onBlur && onBlur({ detail: { value: this.state.value } })
  }

  onKeyPress = (event) => {
    if (event.nativeEvent.key !== 'Enter') return
    const { onConfirm } = this.props
    onConfirm && onConfirm({ detail: { value: this.state.value } })
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
      confirmType,
      confirmHold,
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
        // returnKeyLabel={confirmType}
        returnKeyType={confirmType}
        blurOnSubmit={!confirmHold}
        autoFocus={!!focus}
        selection={selection}
        onChangeText={this.onChangeText}
        value={this.state.value}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyPress={this.onKeyPress}
        style={style}
      />
    )
  }
}

export default _Input
