/**
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

import ColorPropType from './ColorPropType'
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
    '900',
    'ultralight',
    'thin',
    'light',
    'medium',
    'regular',
    'semibold',
    'condensedBold',
    'condensed',
    'heavy',
    'black'
  ]),
  textShadowOffset: ReactPropTypes.shape({
    width: ReactPropTypes.number,
    height: ReactPropTypes.number
  }),
  textShadowRadius: ReactPropTypes.number,
  textShadowColor: ColorPropType,
  letterSpacing: ReactPropTypes.number,
  lineHeight: ReactPropTypes.number,
  /**
   * Specifies text alignment. The value 'justify' is only supported on iOS and
   * fallbacks to `left` on Android.
   */
  textAlign: ReactPropTypes.oneOf([
    'auto',
    'left',
    'right',
    'center',
    'justify'
  ]),
  textDecorationLine: ReactPropTypes.oneOf([
    'none',
    'underline',
    'line-through',
    'underline line-through'
  ]),
  textTransform: ReactPropTypes.oneOf(['none', 'capitalize', 'uppercase', 'lowercase']),
  userSelect: ReactPropTypes.oneOf(['auto', 'none', 'text', 'contain', 'all']),

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
  textDecorationColor: ColorPropType,
  textDecorationStyle: ReactPropTypes.oneOf([
    'solid' /* default */,
    'double',
    'dotted',
    'dashed'
  ]),
  writingDirection: ReactPropTypes.oneOf(['auto' /* default */, 'ltr', 'rtl']),

  /**
   * @platform android
   */
  textAlignVertical: ReactPropTypes.oneOf(['auto', 'top', 'bottom', 'center']),
  verticalAlign: ReactPropTypes.oneOf(['auto', 'top', 'bottom', 'middle']),
  /**
   * Set to `false` to remove extra font padding intended to make space for certain ascenders / descenders.
   * With some fonts, this padding can make text look slightly misaligned when centered vertically.
   * For best results also set `textAlignVertical` to `center`. Default is true.
   * @platform android
   */
  includeFontPadding: ReactPropTypes.bool,
}

export default TextStylePropTypes
