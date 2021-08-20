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

/**
 * Based on css-to-react-native from Krister Kari
 *
 * Copyright (c) 2017 Krister Kari
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import parseFontFamily from './fontFamily'
import { regExpToken, tokens } from '../tokenTypes'

const { SPACE, LENGTH, UNSUPPORTED_LENGTH_UNIT, NUMBER, SLASH } = tokens
const NORMAL = regExpToken(/^(normal)$/)
const STYLE = regExpToken(/^(italic)$/)
const WEIGHT = regExpToken(/^([1-9]00|bold)$/)
const VARIANT = regExpToken(/^(small-caps)$/)

const defaultFontStyle = 'normal'
const defaultFontWeight = 'normal'
const defaultFontVariant = []

export default tokenStream => {
  let fontStyle
  let fontWeight
  let fontVariant
  // let fontSize;
  let lineHeight
  // let fontFamily;

  let numStyleWeightVariantMatched = 0
  while (numStyleWeightVariantMatched < 3 && tokenStream.hasTokens()) {
    if (tokenStream.matches(NORMAL)) {
      /* pass */
    } else if (fontStyle === undefined && tokenStream.matches(STYLE)) {
      fontStyle = tokenStream.lastValue
    } else if (fontWeight === undefined && tokenStream.matches(WEIGHT)) {
      fontWeight = tokenStream.lastValue
    } else if (fontVariant === undefined && tokenStream.matches(VARIANT)) {
      fontVariant = [tokenStream.lastValue]
    } else {
      break
    }

    tokenStream.expect(SPACE)
    numStyleWeightVariantMatched += 1
  }

  const fontSize = tokenStream.expect(LENGTH, UNSUPPORTED_LENGTH_UNIT)

  if (tokenStream.matches(SLASH)) {
    if (tokenStream.matches(NUMBER)) {
      lineHeight = fontSize * tokenStream.lastValue
    } else {
      lineHeight = tokenStream.expect(LENGTH, UNSUPPORTED_LENGTH_UNIT)
    }
  }

  tokenStream.expect(SPACE)

  const fontFamily = parseFontFamily(tokenStream)

  if (fontStyle === undefined) fontStyle = defaultFontStyle
  if (fontWeight === undefined) fontWeight = defaultFontWeight
  if (fontVariant === undefined) fontVariant = defaultFontVariant

  const out = { fontStyle, fontWeight, fontVariant, fontSize, fontFamily }
  if (lineHeight !== undefined) out.lineHeight = lineHeight

  return { $merge: out }
}
