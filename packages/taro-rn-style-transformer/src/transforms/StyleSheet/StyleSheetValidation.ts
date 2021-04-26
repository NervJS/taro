/**
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
