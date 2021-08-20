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
  } else if (valueIfOmitted !== undefined) {
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
