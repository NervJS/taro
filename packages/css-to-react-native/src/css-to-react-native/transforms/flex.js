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

    if (flexGrow === undefined && tokenStream.matches(NUMBER)) {
      flexGrow = tokenStream.lastValue

      tokenStream.saveRewindPoint()
      if (tokenStream.matches(SPACE) && tokenStream.matches(NUMBER)) {
        flexShrink = tokenStream.lastValue
      } else {
        tokenStream.rewind()
      }
    } else if (flexBasis === undefined && tokenStream.matches(LENGTH)) {
      flexBasis = tokenStream.lastValue
    } else if (flexBasis === undefined && tokenStream.matches(AUTO)) {
      flexBasis = 'auto'
    } else {
      tokenStream.throw()
    }

    partsParsed += 1
  }

  tokenStream.expectEmpty()

  if (flexGrow === undefined) flexGrow = defaultFlexGrow
  if (flexShrink === undefined) flexShrink = defaultFlexShrink
  if (flexBasis === undefined) flexBasis = defaultFlexBasis

  return { $merge: { flexGrow, flexShrink, flexBasis } }
}
