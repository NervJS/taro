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

import ColorPropType from './ColorPropType'
import * as ReactPropTypes from 'prop-types'
import ViewStylePropTypes from './ViewStylePropTypes'

const TextStylePropTypes = {
  ...ViewStylePropTypes,

  color: ColorPropType,
  fontFamily: ReactPropTypes.string,
  fontSize: ReactPropTypes.number,
  fontStyle: ReactPropTypes.oneOf(['normal', 'italic']),
  /**
   * Specifies font weight. The values 'normal' and 'bold' are supported for
   * most fonts. Not all fonts have a variant for each of the numeric values,
   * in that case the closest one is chosen.
   */
  fontWeight: ReactPropTypes.oneOf([
    'normal' /* default */,
    'bold',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900'
  ]),
  /**
   * @platform ios
   */
  fontVariant: ReactPropTypes.arrayOf(
    ReactPropTypes.oneOf([
      'small-caps',
      'oldstyle-nums',
      'lining-nums',
      'tabular-nums',
      'proportional-nums'
    ])
  ),
  textShadowOffset: ReactPropTypes.shape({
    width: ReactPropTypes.number,
    height: ReactPropTypes.number
  }),
  textShadowRadius: ReactPropTypes.number,
  textShadowColor: ColorPropType,
  /**
   * @platform ios
   */
  letterSpacing: ReactPropTypes.number,
  lineHeight: ReactPropTypes.number,
  /**
   * Specifies text alignment. The value 'justify' is only supported on iOS and
   * fallbacks to `left` on Android.
   */
  textAlign: ReactPropTypes.oneOf([
    'auto' /* default */,
    'left',
    'right',
    'center',
    'justify'
  ]),
  /**
   * @platform android
   */
  textAlignVertical: ReactPropTypes.oneOf([
    'auto' /* default */,
    'top',
    'bottom',
    'center'
  ]),
  /**
   * Set to `false` to remove extra font padding intended to make space for certain ascenders / descenders.
   * With some fonts, this padding can make text look slightly misaligned when centered vertically.
   * For best results also set `textAlignVertical` to `center`. Default is true.
   * @platform android
   */
  includeFontPadding: ReactPropTypes.bool,
  textDecorationLine: ReactPropTypes.oneOf([
    'none' /* default */,
    'underline',
    'line-through',
    'underline line-through'
  ]),
  /**
   * @platform ios
   */
  textDecorationStyle: ReactPropTypes.oneOf([
    'solid' /* default */,
    'double',
    'dotted',
    'dashed'
  ]),
  /**
   * @platform ios
   */
  textDecorationColor: ColorPropType,
  textTransform: ReactPropTypes.oneOf([
    'none' /* default */,
    'capitalize',
    'uppercase',
    'lowercase'
  ]),
  /**
   * @platform ios
   */
  writingDirection: ReactPropTypes.oneOf(['auto' /* default */, 'ltr', 'rtl'])
}

export default TextStylePropTypes
