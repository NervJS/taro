/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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

const _Textarea: React.FC<TextareaProps> = (props: TextareaProps) => {
  const { autoHeight, onLineChange, autoFocus, maxlength } = props
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
        'maxlength'
      ])}
      maxlength={maxlength}
    />
  )
}

_Textarea.displayName = '_Textarea'

export default _Textarea
