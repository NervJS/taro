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
import { anyOrderFactory, directionFactory } from './util'

const { WORD, FUNC, COLOR, LENGTH, UNSUPPORTED_LENGTH_UNIT } = tokens

function borderDirectionFactory (direction = '') {
  const prefix = `border${direction}`
  return anyOrderFactory({
    [`${prefix}Width`]: {
      tokens: [LENGTH, UNSUPPORTED_LENGTH_UNIT],
      default: 1,
    },
    [`${prefix}Color`]: {
      tokens: [COLOR],
      default: 'black',
    },
    // RN 不支持 borderTopStyle，解析成 borderStyle
    [`borderStyle`]: {
      tokens: [regExpToken(/^(solid|dashed|dotted)$/)],
      default: 'solid',
    },
  })
}

export const border = borderDirectionFactory()

export const borderTop = borderDirectionFactory('Top')
export const borderRight = borderDirectionFactory('Right')
export const borderBottom = borderDirectionFactory('Bottom')
export const borderLeft = borderDirectionFactory('Left')

export const borderColor = directionFactory({
  types: [WORD, FUNC],
  prefix: 'border',
  suffix: 'Color',
})

export const borderRadius = directionFactory({
  directions: ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'],
  prefix: 'border',
  suffix: 'Radius',
})

export const borderWidth = directionFactory({
  prefix: 'border',
  suffix: 'Width',
})
