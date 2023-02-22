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

const { SPACE, COMMA, LENGTH, NUMBER, ANGLE } = tokens

const oneOfType = tokenType => functionStream => {
  const value = functionStream.expect(tokenType)
  functionStream.expectEmpty()
  return value
}

const singleNumber = oneOfType(NUMBER)
const singleLength = oneOfType(LENGTH)
const singleAngle = oneOfType(ANGLE)
const xyTransformFactory = tokenType => (
  key,
  valueIfOmitted
) => functionStream => {
  const x = functionStream.expect(tokenType)

  let y
  if (functionStream.hasTokens()) {
    functionStream.expect(COMMA)
    y = functionStream.expect(tokenType)
  } else if (typeof valueIfOmitted !== 'undefined') {
    y = valueIfOmitted
  } else {
    // Assumption, if x === y, then we can omit XY
    // I.e. scale(5) => [{ scale: 5 }] rather than [{ scaleX: 5 }, { scaleY: 5 }]
    return x
  }

  functionStream.expectEmpty()

  return [{ [`${key}Y`]: y }, { [`${key}X`]: x }]
}
const xyNumber = xyTransformFactory(NUMBER)
const xyLength = xyTransformFactory(LENGTH)
const xyAngle = xyTransformFactory(ANGLE)

const partTransforms = {
  perspective: singleNumber,
  scale: xyNumber('scale'),
  scaleX: singleNumber,
  scaleY: singleNumber,
  translate: xyLength('translate', 0),
  translateX: singleLength,
  translateY: singleLength,
  rotate: singleAngle,
  rotateX: singleAngle,
  rotateY: singleAngle,
  rotateZ: singleAngle,
  skewX: singleAngle,
  skewY: singleAngle,
  skew: xyAngle('skew', '0deg')
}

export default tokenStream => {
  let transforms = []

  let didParseFirst = false
  while (tokenStream.hasTokens()) {
    if (didParseFirst) tokenStream.expect(SPACE)

    const functionStream = tokenStream.expectFunction()
    const { functionName } = functionStream
    let transformedValues = partTransforms[functionName](functionStream)
    if (!Array.isArray(transformedValues)) {
      transformedValues = [{ [functionName]: transformedValues }]
    }
    transforms = transformedValues.concat(transforms)

    didParseFirst = true
  }

  return transforms
}
