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
import {
  border,
  borderBottom,
  borderColor,
  borderLeft,
  borderRadius,
  borderRight,
  borderTop,
  borderWidth,
} from './border'
import boxShadow from './boxShadow'
import flex from './flex'
import font from './font'
import fontFamily from './fontFamily'
import textDecoration from './textDecoration'
import textDecorationLine from './textDecorationLine'
import textShadow from './textShadow'
import transform from './transform'
import { anyOrderFactory, directionFactory, shadowOffsetFactory } from './util'

const { IDENT, WORD, COLOR, LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT, AUTO } =
  tokens

const background = (tokenStream) => ({
  $merge: { backgroundColor: tokenStream.expect(COLOR) },
})
const margin = directionFactory({
  types: [LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT, AUTO],
  prefix: 'margin',
})
const padding = directionFactory({ prefix: 'padding' })
const flexFlow = anyOrderFactory({
  flexWrap: {
    tokens: [regExpToken(/(nowrap|wrap|wrap-reverse)/)],
    default: 'nowrap',
  },
  flexDirection: {
    tokens: [regExpToken(/(row|row-reverse|column|column-reverse)/)],
    default: 'row',
  },
})
const fontVariant = (tokenStream) => [tokenStream.expect(IDENT)]
const fontWeight = (tokenStream) => tokenStream.expect(WORD) // Also match numbers as strings
const shadowOffset = shadowOffsetFactory()
const textShadowOffset = shadowOffsetFactory()

export default {
  background,
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  borderColor,
  borderRadius,
  borderWidth,
  boxShadow,
  flex,
  flexFlow,
  font,
  fontFamily,
  fontVariant,
  fontWeight,
  margin,
  padding,
  shadowOffset,
  textShadow,
  textShadowOffset,
  textDecoration,
  textDecorationLine,
  transform,
}
