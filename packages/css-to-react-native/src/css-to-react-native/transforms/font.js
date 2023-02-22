/* 
 * MIT License
 * 
 * Copyright (c) 2016 Jacob Parker and Maximilian Stoiber
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { regExpToken, tokens } from '../tokenTypes'
import parseFontFamily from './fontFamily'

const { SPACE, LENGTH, UNSUPPORTED_LENGTH_UNIT, NUMBER, SLASH } = tokens
const NORMAL = regExpToken(/^(normal)$/)
const STYLE = regExpToken(/^(italic)$/)
const WEIGHT = regExpToken(/^([1-9]00|bold)$/)
const VARIANT = regExpToken(/^(small-caps)$/)

const defaultFontStyle = 'normal'
const defaultFontWeight = 'normal'
const defaultFontVariant = []

export default (tokenStream) => {
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
    } else if (typeof fontStyle === 'undefined' && tokenStream.matches(STYLE)) {
      fontStyle = tokenStream.lastValue
    } else if (
      typeof fontWeight === 'undefined' &&
      tokenStream.matches(WEIGHT)
    ) {
      fontWeight = tokenStream.lastValue
    } else if (
      typeof fontVariant === 'undefined' &&
      tokenStream.matches(VARIANT)
    ) {
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
      const size =
        typeof fontSize === 'string'
          ? fontSize.replace(/scalePx2dp\((\d+)\)/, '$1')
          : fontSize
      lineHeight = size * tokenStream.lastValue
    } else {
      lineHeight = tokenStream.expect(LENGTH, UNSUPPORTED_LENGTH_UNIT)
    }
  }

  tokenStream.expect(SPACE)

  const fontFamily = parseFontFamily(tokenStream)

  if (typeof fontStyle === 'undefined') fontStyle = defaultFontStyle
  if (typeof fontWeight === 'undefined') fontWeight = defaultFontWeight
  if (typeof fontVariant === 'undefined') fontVariant = defaultFontVariant

  const out = { fontStyle, fontWeight, fontVariant, fontSize, fontFamily }
  if (typeof lineHeight !== 'undefined') out.lineHeight = lineHeight

  return { $merge: out }
}
