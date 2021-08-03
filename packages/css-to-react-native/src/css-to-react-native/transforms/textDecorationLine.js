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

const { SPACE, LINE } = tokens

export default tokenStream => {
  const lines = []

  let didParseFirst = false
  while (tokenStream.hasTokens()) {
    if (didParseFirst) tokenStream.expect(SPACE)

    lines.push(tokenStream.expect(LINE).toLowerCase())

    didParseFirst = true
  }

  lines.sort().reverse()

  return lines.join(' ')
}
