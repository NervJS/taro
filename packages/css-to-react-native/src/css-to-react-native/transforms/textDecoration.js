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

    if (line === undefined && tokenStream.matches(LINE)) {
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
    } else if (style === undefined && tokenStream.matches(STYLE)) {
      style = tokenStream.lastValue
    } else if (color === undefined && tokenStream.matches(COLOR)) {
      color = tokenStream.lastValue
    } else {
      tokenStream.throw()
    }

    didParseFirst = true
  }

  const $merge = {
    textDecorationLine: line !== undefined ? line : defaultTextDecorationLine,
    textDecorationColor:
      color !== undefined ? color : defaultTextDecorationColor,
    textDecorationStyle:
      style !== undefined ? style : defaultTextDecorationStyle
  }
  return { $merge }
}
