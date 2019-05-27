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
import Input from '../Input'
import { omit } from '../../utils'
import { TextareaProps } from './PropsType'

const _Textarea: React.SFC<TextareaProps> = (props) => {
  const {
    autoHeight,
    onLineChange
  } = props

  return (
    <Input
      _multiline={true}
      _autoHeight={autoHeight}
      _onLineChange={onLineChange}
      {...omit(props, [
        'type',
        'password',
        'confirmType',
        'confirmHold',
        // props
        'autoHeight',
        'onLineChange'
      ])}
    />
  )
}

_Textarea.displayName = '_Textarea'

export default _Textarea
