/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *       strict-local
 */

// const UIManager = require('UIManager')

/**
 * Adds a deprecation warning when the prop is used.
 */
export default function deprecatedPropType (
  propType,
  explanation
) {
  return function validate (props, propName, componentName, ...rest) {
    // Don't warn for native components.
    // if (!UIManager[componentName] && props[propName] !== undefined) {
    if (props[propName] !== undefined) {
      console.warn(
        `\`${propName}\` supplied to \`${componentName}\` has been deprecated. ${explanation}`
      )
    }

    return propType(props, propName, componentName, ...rest)
  }
}
