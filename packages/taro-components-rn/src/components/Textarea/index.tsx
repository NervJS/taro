/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

import * as React from 'react'
import { Keyboard } from 'react-native'
import Input from '../Input'
import { omit } from '../../utils'
import { TextareaProps } from './PropsType'

const _Textarea: React.FC<TextareaProps> = (props: TextareaProps) => {
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
