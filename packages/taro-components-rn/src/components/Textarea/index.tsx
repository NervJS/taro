/**
 * Compared with Input:
 *   Subtraction:
 *     type, password, confirmType, confirmHold
 *   Addition:
 *     ✔ autoHeight(auto-height)
 *     ✘ fixed
 *     ✘ show-confirm-bar
 *     ✔ onLineChange(bindlinechange): No heightRpx info.
 */

import * as React from 'react'
import { Keyboard, TextInput } from 'react-native'
import { Input } from '../Input'
import { omit } from '../../utils'
import { TextareaProps } from './PropsType'

const _Textarea: React.FC<TextareaProps> = (props: TextareaProps) => {
  const { autoHeight, onLineChange, autoFocus, maxlength, forwardedRef } = props
  return (
    <Input
      _multiline={true}
      _autoHeight={autoHeight}
      _onLineChange={onLineChange}
      autoFocus={!!autoFocus}
      confirmType="next"
      onBlur={() => Keyboard.dismiss()}
      {...omit(props, [
        'type',
        'password',
        'confirmType',
        'confirmHold',
        // props
        'autoHeight',
        'onLineChange',
        'maxlength',
        'forwardedRef',
      ])}
      maxlength={maxlength}
      forwardedRef={forwardedRef}
    />
  )
}

_Textarea.displayName = '_Textarea'

export default React.forwardRef((props:TextareaProps, ref: React.ForwardedRef<TextInput>) => {
  return <_Textarea {...props} forwardedRef={ref} />
})
