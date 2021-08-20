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
 * 
 * Based on react-native from Facebook, Inc.
 * 
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *
 */

import ImageStylePropTypes from './ImageStylePropTypes'
import TextStylePropTypes from './TextStylePropTypes'
import ViewStylePropTypes from './ViewStylePropTypes'

import invariant from 'fbjs/lib/invariant'

// Hardcoded because this is a legit case but we don't want to load it from
// a private API. We might likely want to unify style sheet creation with how it
// is done in the DOM so this might move into React. I know what I'm doing so
// plz don't fire me.
const ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'

class StyleSheetValidation {
  static validateStyleProp (prop, style, caller) {
    if (allStylePropTypes[prop] === undefined) {
      const message1 = '"' + prop + '" 不是一个有效的 React Native 样式属性'
      // const message2 =
      //   '\nValid style props: ' +
      //   JSON.stringify(Object.keys(allStylePropTypes).sort(), null, '  ')
      // styleError(message1, style, caller, message2)
      styleError(message1, style, caller)
    }
    const error = allStylePropTypes[prop](
      style,
      prop,
      caller,
      'prop',
      null,
      ReactPropTypesSecret
    )
    if (error) {
      styleError(error.message, style, caller)
    }
  }

  static validateStyle (name, styles) {
    for (const prop in styles[name]) {
      StyleSheetValidation.validateStyleProp(
        prop,
        styles[name],
        'StyleSheet ' + name
      )
    }
  }

  static addValidStylePropTypes (stylePropTypes) {
    for (const key in stylePropTypes) {
      allStylePropTypes[key] = stylePropTypes[key]
    }
  }
}

const styleError = function (message1, style, caller, message2?) {
  invariant(
    false,
    message1 +
    '\n' +
    (caller || '<<unknown>>') +
    ': ' +
    JSON.stringify(style, null, '  ') +
    (message2 || '')
  )
}

const allStylePropTypes = {}

StyleSheetValidation.addValidStylePropTypes(ImageStylePropTypes)
StyleSheetValidation.addValidStylePropTypes(TextStylePropTypes)
StyleSheetValidation.addValidStylePropTypes(ViewStylePropTypes)

export default StyleSheetValidation
