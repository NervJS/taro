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
 *
 * @format
 */
import ColorPropType from './ColorPropType'
import * as ReactPropTypes from 'prop-types'

/**
 * These props can be used to dynamically generate shadows on views, images, text, etc.
 *
 * Because they are dynamically generated, they may cause performance regressions. Static
 * shadow image asset may be a better way to go for optimal performance.
 *
 * These properties are iOS only - for similar functionality on Android, use the [`elevation`
 * property](docs/viewstyleproptypes.html#elevation).
 */
const ShadowPropTypesIOS = {
  /**
   * Sets the drop shadow color
   * @platform ios
   */
  shadowColor: ColorPropType,
  /**
   * Sets the drop shadow offset
   * @platform ios
   */
  shadowOffset: ReactPropTypes.shape({
    width: ReactPropTypes.number,
    height: ReactPropTypes.number
  }),
  /**
   * Sets the drop shadow opacity (multiplied by the color's alpha component)
   * @platform ios
   */
  shadowOpacity: ReactPropTypes.number,
  /**
   * Sets the drop shadow blur radius
   * @platform ios
   */
  shadowRadius: ReactPropTypes.number
}

export default ShadowPropTypesIOS
