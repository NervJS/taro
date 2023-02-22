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

const { SPACE, LINE, COLOR } = tokens

const STYLE = regExpToken(/^(solid|double|dotted|dashed)$/)

const defaultTextDecorationLine = 'none'
const defaultTextDecorationStyle = 'solid'
const defaultTextDecorationColor = 'black'

export default tokenStream => {
  let line
  let style
  let color

  let didParseFirst = false
  while (tokenStream.hasTokens()) {
    if (didParseFirst) tokenStream.expect(SPACE)

    if (typeof line === 'undefined' && tokenStream.matches(LINE)) {
      const lines = [tokenStream.lastValue.toLowerCase()]

      tokenStream.saveRewindPoint()
      if (
        lines[0] !== 'none' &&
        tokenStream.matches(SPACE) &&
        tokenStream.matches(LINE)
      ) {
        lines.push(tokenStream.lastValue.toLowerCase())
        // Underline comes before line-through
        lines.sort().reverse()
      } else {
        tokenStream.rewind()
      }

      line = lines.join(' ')
    } else if (typeof style === 'undefined' && tokenStream.matches(STYLE)) {
      style = tokenStream.lastValue
    } else if (typeof color === 'undefined' && tokenStream.matches(COLOR)) {
      color = tokenStream.lastValue
    } else {
      tokenStream.throw()
    }

    didParseFirst = true
  }

  const $merge = {
    textDecorationLine: typeof line !== 'undefined' ? line : defaultTextDecorationLine,
    textDecorationColor:
      typeof color !== 'undefined' ? color : defaultTextDecorationColor,
    textDecorationStyle:
      typeof style !== 'undefined' ? style : defaultTextDecorationStyle
  }
  return { $merge }
}
