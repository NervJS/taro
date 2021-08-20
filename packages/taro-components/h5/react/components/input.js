/*
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

import React from 'react'
import reactifyWc from '../utils/reactify-wc'
const Input = reactifyWc('taro-input-core')

// eslint-disable-next-line
const h = React.createElement

export default React.forwardRef((props, ref) => {
  const args = { ...props }

  if (args.hasOwnProperty('focus')) {
    args.autoFocus = Boolean(args.focus)
    delete args.focus
  }

  return (
    React.createElement(Input, { ...args, ref: ref })
  )
})
