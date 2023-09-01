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
import { Keyboard } from 'react-native'
import Input from '../Input'
import { omit } from '../../utils'
import { TextareaProps } from './PropsType'

const _Textarea: React.FC<TextareaProps> = (props) => {
  const { autoHeight, autoFocus, focus, maxlength, onLineChange } = props
  const textearaProps = omit(props, [
    'type',
    'password',
    'confirmType',
    'confirmHold',
    // props
    'autoHeight',
    'onLineChange',
    'maxlength'
  ])

  return (
    <Input
      _multiline={true}
      _autoHeight={autoHeight}
      _onLineChange={onLineChange}
      focus={!!focus}
      autoFocus={!!autoFocus}
      confirmType="next"
      onBlur={() => Keyboard.dismiss()}
      {...textearaProps}
      maxlength={maxlength}
    />
  )
}

_Textarea.displayName = '_Textarea'

export default _Textarea
