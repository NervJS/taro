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

const { SPACE, IDENT, STRING } = tokens

export default tokenStream => {
  let fontFamily

  if (tokenStream.matches(STRING)) {
    fontFamily = tokenStream.lastValue
  } else {
    fontFamily = tokenStream.expect(IDENT)
    while (tokenStream.hasTokens()) {
      tokenStream.expect(SPACE)
      const nextIdent = tokenStream.expect(IDENT)
      fontFamily += ` ${nextIdent}`
    }
  }

  tokenStream.expectEmpty()

  return fontFamily
}
