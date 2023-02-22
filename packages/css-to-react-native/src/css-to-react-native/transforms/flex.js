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

import { tokens } from '../tokenTypes'

const { NONE, AUTO, NUMBER, LENGTH, SPACE } = tokens

const defaultFlexGrow = 1
const defaultFlexShrink = 1
const defaultFlexBasis = 0

export default tokenStream => {
  let flexGrow
  let flexShrink
  let flexBasis

  if (tokenStream.matches(NONE)) {
    tokenStream.expectEmpty()
    return { $merge: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto' } }
  }

  tokenStream.saveRewindPoint()
  if (tokenStream.matches(AUTO) && !tokenStream.hasTokens()) {
    return { $merge: { flexGrow: 1, flexShrink: 1, flexBasis: 'auto' } }
  }
  tokenStream.rewind()

  let partsParsed = 0
  while (partsParsed < 2 && tokenStream.hasTokens()) {
    if (partsParsed !== 0) tokenStream.expect(SPACE)

    if (typeof flexGrow === 'undefined' && tokenStream.matches(NUMBER)) {
      flexGrow = tokenStream.lastValue

      tokenStream.saveRewindPoint()
      if (tokenStream.matches(SPACE) && tokenStream.matches(NUMBER)) {
        flexShrink = tokenStream.lastValue
      } else {
        tokenStream.rewind()
      }
    } else if (typeof flexBasis === 'undefined' && tokenStream.matches(LENGTH)) {
      flexBasis = tokenStream.lastValue
    } else if (typeof flexBasis === 'undefined' && tokenStream.matches(AUTO)) {
      flexBasis = 'auto'
    } else {
      tokenStream.throw()
    }

    partsParsed += 1
  }

  tokenStream.expectEmpty()

  if (typeof flexGrow === 'undefined') flexGrow = defaultFlexGrow
  if (typeof flexShrink === 'undefined') flexShrink = defaultFlexShrink
  if (typeof flexBasis === 'undefined') flexBasis = defaultFlexBasis

  return { $merge: { flexGrow, flexShrink, flexBasis } }
}
