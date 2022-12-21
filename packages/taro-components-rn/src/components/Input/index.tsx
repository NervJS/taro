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
import { noop, omit, parseStyles, useUpdateEffect } from '../../utils'
import { InputProps } from './PropsType'

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

const defaultProps = {
  type: 'text',
  maxlength: 140,
  confirmType: 'done',
  selectionStart: -1,
  selectionEnd: -1
}

const _Input = (props: InputProps) => {
  const {
    style,
    value,
    type = defaultProps.type,
    password,
    placeholder,
    disabled,
    maxlength = defaultProps.maxlength,
    confirmType,
    confirmHold,
    cursor,
    selectionStart = defaultProps.selectionStart,
    selectionEnd = defaultProps.selectionEnd,
    _multiline,
    _autoHeight,
    autoFocus,
    focus,
    placeholderStyle
  } = props

  const [returnValue, setReturnValue] = React.useState<string>()
  /** 用于保存输入框值 */
  const tmpValue = React.useRef<string>()
  const [_height, setHeight] = React.useState(0)
  const lineCount = React.useRef(0)
  const inputRef = React.useRef<any>()

  React.useEffect(() => {
    tmpValue.current = value
    setReturnValue(val => {
      if (val !== value) {
        return value
      }
      return val
    })
  }, [returnValue, value])

  // fix: https://github.com/NervJS/taro/issues/11350
  useUpdateEffect(() => {
    if (!inputRef.current) {
      return
    }
    if (focus) {
      inputRef.current.focus()
    } else {
      inputRef.current.blur()
    }
  }, [focus])

  const onChangeText = React.useCallback((text: string): void => {
    const { onInput, onChange } = props
    const onEvent = onInput || onChange
    tmpValue.current = text || ''

    if (onEvent) {
      const result: unknown = onEvent({
        target: { value: text },
        detail: { value: text }
      })
      // Be care of flickering
      // @see https://facebook.github.io/react-native/docs/textinput.html#value
      if (typeof result === 'string') {
        tmpValue.current = result
        setReturnValue(result)
      } else if (returnValue) {
        // 为了处理输入不合法，setState 相同值时，状态不更新，UI 也得不到更新，重置状态进而更新
        setReturnValue(undefined)
      }
    }
  }, [returnValue])

  const onFocus = React.useCallback((): void => {
    const { onFocus = noop } = props

    onFocus({
      target: { value: tmpValue.current || '' },
      detail: { value: tmpValue.current || '' }
    })
  }, [returnValue])

  const onBlur = React.useCallback((): void => {
    const { onBlur = noop } = props

    onBlur({
      target: { value: tmpValue.current || '' },
      detail: { value: tmpValue.current || '' }
    })
  }, [])

  /**
   * Callback that is called when a key is pressed.
   * This will be called with `{ nativeEvent: { key: keyValue } }`
   * where `keyValue` is `'Enter'` or `'Backspace'` for respective keys and
   * the typed-in character otherwise including `' '` for space.
   * Fires before `onChange` callbacks.
   */
  const onKeyPress = React.useCallback((event: NativeSyntheticEvent<TextInputKeyPressEventData>): void => {
    const { onKeyDown = noop, onConfirm = noop } = props
    const keyValue = event.nativeEvent.key
    let which
    keyValue === 'Enter' && (which = 13)
    keyValue === 'Backspace' && (which = 8)
    onKeyDown({
      which,
      target: { value: tmpValue.current || '' },
      detail: { value: tmpValue.current || '' }
    })
    if (keyValue !== 'Enter') return
    onConfirm({
      target: { value: tmpValue.current || '' },
      detail: { value: tmpValue.current || '' }
    })
  }, [])

  const onSubmitEditing = React.useCallback((): void => {
    const { onKeyDown = noop, onConfirm = noop } = props
    if (_multiline) return
    onKeyDown({
      which: 13,
      target: { value: tmpValue.current || '' },
      detail: { value: tmpValue.current || '' }
    })
    onConfirm({
      target: { value: tmpValue.current || '' },
      detail: { value: tmpValue.current || '' }
    })
  }, [_multiline])

  const onContentSizeChange = React.useCallback((event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>): void => {
    const { width, height } = event.nativeEvent.contentSize
    // One of width and height may be 0.
    if (width && height) {
      const { _onLineChange = noop } = props
      if (!_multiline || !_autoHeight || height === _height) return
      lineCount.current += height > _height ? 1 : -1
      _onLineChange({ detail: { height, lineCount: lineCount.current } })
      setHeight(height)
    }
  }, [_height, _multiline, _autoHeight])

  const keyboardType: KeyboardTypeOptions = keyboardTypeMap[type] as KeyboardTypeOptions
  const selection = (() => {
    if (selectionStart >= 0 && selectionEnd >= 0) {
      return { start: selectionStart, end: selectionEnd }
    } else if (typeof cursor === 'number') {
      return { start: cursor, end: cursor }
    }
  })()

  const defaultValue = type === 'number' && value ? value + '' : value

  // fix: https://reactnative.dev/docs/textinput#multiline
  const textAlignVertical = _multiline ? 'top' : 'auto'
  const placeholderTextColor = props.placeholderTextColor || parseStyles(placeholderStyle)?.color

  const inputProps = omit(props, [
    'style',
    'value',
    'type',
    'password',
    'placeholder',
    'disabled',
    'maxlength',
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
    '_onLineChange',
    'placeholderStyle',
    'placeholderTextColor',
  ])

  return (
    <TextInput
      {...inputProps}
      ref={inputRef}
      defaultValue={defaultValue}
      keyboardType={keyboardType}
      secureTextEntry={!!password}
      placeholder={placeholder}
      editable={!disabled}
      maxLength={maxlength === -1 ? undefined : maxlength}
      // returnKeyLabel={confirmType}
      returnKeyType={confirmType}
      blurOnSubmit={!_multiline && !confirmHold}
      autoFocus={!!autoFocus || !!focus}
      selection={selection}
      onChangeText={onChangeText}
      value={returnValue}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyPress={onKeyPress}
      onSubmitEditing={onSubmitEditing}
      multiline={!!_multiline}
      textAlignVertical={textAlignVertical}
      onContentSizeChange={onContentSizeChange}
      underlineColorAndroid="rgba(0,0,0,0)"
      placeholderTextColor={placeholderTextColor}
      style={[
        {
          padding: 0
        },
        style,
        // @ts-ignore
        _multiline && _autoHeight && { height: Math.max(style?.minHeight || 35, _height) }
      ]}
    />
  )
}

_Input.defaultProps = defaultProps as InputProps

_Input.displayName = '_Input'

export default _Input
