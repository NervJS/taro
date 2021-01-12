/**
 * ✔ value
 * ✘ type: Partially.
 * ✔ password
 * ✔ placeholder
 * ✘ placeholder-style: Only placeholderTextColor(RN).
 * - placeholder-class
 * ✔ disabled
 * ✔ maxLength
 * ✘ cursor-spacing
 * - auto-focus
 * ✔ focus
 * ✔ confirmType(confirm-type)
 * ✔ confirmHold(confirm-hold)
 * ✔ cursor
 * ✔ selectionStart(selection-start)
 * ✔ selectionEnd(selection-end)
 * ✘ adjust-position
 * ✔ onInput(bindinput): No CURSOR info.
 * ✔ onFocus(bindfocus): No HEIGHT info.
 * ✔ onBlur(bindblur): No CURSOR info.
 * ✔ onConfirm(bindconfirm)
 *
 * @todo KeyboardAvoidingView
 */

import * as React from 'react'
import {
  TextInput,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputContentSizeChangeEventData,
  KeyboardTypeOptions
} from 'react-native'
import { noop, omit } from '../../utils'
import { InputProps, InputState } from './PropsType'

const keyboardTypeMap: { [key: string]: string } = {
  text: 'default',
  number: 'numeric',
  idcard: 'default',
  digit:
    Platform.select({
      ios: 'decimal-pad',
      android: 'numeric'
    }) || ''
}

// const confirmTypeMap = {
//   done: '完成',
//   send: '发送',
//   search: '搜索',
//   next: '下一个',
//   go: '前往',
// }

class _Input extends React.Component<InputProps, InputState> {
  static defaultProps = {
    type: 'text',
    maxLength: 140,
    confirmType: 'done',
    selectionStart: -1,
    selectionEnd: -1
  }

  static getDerivedStateFromProps(props: InputProps, state: InputState): InputState | null {
    return props.value !== state.value
      ? {
          ...state,
          returnValue: props.value
        }
      : null
  }

  state: InputState = {
    returnValue: undefined,
    height: 0,
    value: undefined
  }

  tmpValue?: string
  lineCount = 0

  onChangeText = (text: string): void => {
    const { onInput, onChange } = this.props
    const { returnValue } = this.state
    const onEvent = onInput || onChange
    this.tmpValue = text || ''
    if (onEvent) {
      const result: unknown = onEvent({
        target: { value: text },
        detail: { value: text }
      })
      // Be care of flickering
      // @see https://facebook.github.io/react-native/docs/textinput.html#value
      if (typeof result === 'string') {
        this.tmpValue = result
        this.setState({ returnValue: result })
      } else if (returnValue) {
        this.setState({ returnValue: undefined })
      }
    }
  }

  onFocus = ():void => {
    const { onFocus = noop } = this.props
    // event.detail = { value, height }
    const { returnValue } = this.state
    this.tmpValue = returnValue || ''

    onFocus({
      target: { value: this.tmpValue || '' },
      detail: { value: this.tmpValue || '' }
    })
  }

  onBlur = ():void => {
    const { onBlur = noop } = this.props
    onBlur({
      target: { value: this.tmpValue || '' },
      detail: { value: this.tmpValue || '' }
    })
  }

  /**
   * Callback that is called when a key is pressed.
   * This will be called with `{ nativeEvent: { key: keyValue } }`
   * where `keyValue` is `'Enter'` or `'Backspace'` for respective keys and
   * the typed-in character otherwise including `' '` for space.
   * Fires before `onChange` callbacks.
   */
  onKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>):void => {
    const { onKeyDown = noop, onConfirm = noop } = this.props
    const keyValue = event.nativeEvent.key
    let which
    keyValue === 'Enter' && (which = 13)
    keyValue === 'Backspace' && (which = 8)
    onKeyDown({
      which,
      target: { value: this.tmpValue || '' },
      detail: { value: this.tmpValue || '' }
    })
    if (keyValue !== 'Enter') return
    onConfirm({
      target: { value: this.tmpValue || '' },
      detail: { value: this.tmpValue || '' }
    })
  }

  onSubmitEditing = ():void => {
    const { onKeyDown = noop, onConfirm = noop, _multiline } = this.props
    if (_multiline) return
    onKeyDown({
      which: 13,
      target: { value: this.tmpValue || '' },
      detail: { value: this.tmpValue || '' }
    })
    onConfirm({
      target: { value: this.tmpValue || '' },
      detail: { value: this.tmpValue || '' }
    })
  }

  onContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>):void => {
    const { width, height } = event.nativeEvent.contentSize
    // One of width and height may be 0.
    if (width && height) {
      const { _multiline, _autoHeight, _onLineChange = noop } = this.props
      if (!_multiline || !_autoHeight || height === this.state.height) return
      this.lineCount += height > this.state.height ? 1 : -1
      _onLineChange({ detail: { height, lineCount: this.lineCount } })
      this.setState({ height })
    }
  }

  render(): JSX.Element {
    let {
      style,
      value,
      type,
      password,
      placeholder,
      disabled,
      maxLength,
      confirmType,
      confirmHold,
      cursor,
      selectionStart,
      selectionEnd,
      _multiline,
      _autoHeight,
      autoFocus
    } = this.props

    const keyboardType: KeyboardTypeOptions = keyboardTypeMap[type] as KeyboardTypeOptions

    const selection = (() => {
      if (selectionStart >= 0 && selectionEnd >= 0) {
        return { start: selectionStart, end: selectionEnd }
      } else if (typeof cursor === 'number') {
        return { start: cursor, end: cursor }
      }
    })()

    value = type === 'number' && value ? value + '' : value

    return (
      <TextInput
        {...omit(this.props, [
          'style',
          'value',
          'type',
          'password',
          'placeholder',
          'disabled',
          'maxLength',
          'focus',
          'confirmType',
          'confirmHold',
          'cursor',
          'selectionStart',
          'selectionEnd',
          'onInput',
          'onFocus',
          'onBlur',
          'onKeyDown',
          'onConfirm',
          '_multiline',
          '_autoHeight',
          '_onLineChange'
        ])}
        defaultValue={value}
        keyboardType={keyboardType}
        secureTextEntry={!!password}
        placeholder={placeholder}
        editable={!disabled}
        maxLength={maxLength === -1 ? undefined : maxLength}
        // returnKeyLabel={confirmType}
        returnKeyType={confirmType}
        blurOnSubmit={!_multiline && !confirmHold}
        autoFocus={!!autoFocus}
        selection={selection}
        onChangeText={this.onChangeText}
        value={this.state.returnValue}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyPress={this.onKeyPress}
        onSubmitEditing={this.onSubmitEditing}
        multiline={!!_multiline}
        onContentSizeChange={this.onContentSizeChange}
        underlineColorAndroid="rgba(0,0,0,0)"
        style={[style, _multiline && _autoHeight && { height: Math.max(35, this.state.height) }]}
      />
    )
  }
}

export default _Input
