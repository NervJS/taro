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

'use strict'

import * as ReactPropTypes from 'prop-types'

import deprecatedPropType from './deprecatedPropType'

const TransformMatrixPropType = function (
  props,
  propName,
  _componentName
) {
  if (props[propName]) {
    return new Error(
      'The transformMatrix style property is deprecated. ' +
      'Use `transform: [{ matrix: ... }]` instead.'
    )
  }
}

const DecomposedMatrixPropType = function (
  props,
  propName,
  _componentName
) {
  if (props[propName]) {
    return new Error(
      'The decomposedMatrix style property is deprecated. ' +
      'Use `transform: [...]` instead.'
    )
  }
}

const TransformPropTypes = {
  /**
   * `transform` accepts an array of transformation objects. Each object specifies
   * the property that will be transformed as the key, and the value to use in the
   * transformation. Objects should not be combined. Use a single key/value pair
   * per object.
   *
   * The rotate transformations require a string so that the transform may be
   * expressed in degrees (deg) or radians (rad). For example:
   *
   * `transform([{ rotateX: '45deg' }, { rotateZ: '0.785398rad' }])`
   *
   * The skew transformations require a string so that the transform may be
   * expressed in degrees (deg). For example:
   *
   * `transform([{ skewX: '45deg' }])`
   */
  transform: ReactPropTypes.arrayOf(
    ReactPropTypes.oneOfType([
      ReactPropTypes.shape({ perspective: ReactPropTypes.number }),
      ReactPropTypes.shape({ rotate: ReactPropTypes.string }),
      ReactPropTypes.shape({ rotateX: ReactPropTypes.string }),
      ReactPropTypes.shape({ rotateY: ReactPropTypes.string }),
      ReactPropTypes.shape({ rotateZ: ReactPropTypes.string }),
      ReactPropTypes.shape({ scale: ReactPropTypes.number }),
      ReactPropTypes.shape({ scaleX: ReactPropTypes.number }),
      ReactPropTypes.shape({ scaleY: ReactPropTypes.number }),
      ReactPropTypes.shape({ translateX: ReactPropTypes.number }),
      ReactPropTypes.shape({ translateY: ReactPropTypes.number }),
      ReactPropTypes.shape({ skewX: ReactPropTypes.string }),
      ReactPropTypes.shape({ skewY: ReactPropTypes.string })
    ])
  ),

  /**
   * Deprecated. Use the transform prop instead.
   */
  transformMatrix: TransformMatrixPropType,
  /**
   * Deprecated. Use the transform prop instead.
   */
  decomposedMatrix: DecomposedMatrixPropType,

  /* Deprecated transform props used on Android only */
  scaleX: deprecatedPropType(
    ReactPropTypes.number,
    'Use the transform prop instead.'
  ),
  scaleY: deprecatedPropType(
    ReactPropTypes.number,
    'Use the transform prop instead.'
  ),
  rotation: deprecatedPropType(
    ReactPropTypes.number,
    'Use the transform prop instead.'
  ),
  translateX: deprecatedPropType(
    ReactPropTypes.number,
    'Use the transform prop instead.'
  ),
  translateY: deprecatedPropType(
    ReactPropTypes.number,
    'Use the transform prop instead.'
  )
}

export default TransformPropTypes
