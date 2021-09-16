/**
 * Based on css-to-react-native from Krister Kari
 *
 * Copyright (c) 2017 Krister Kari
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { parseShadow } from './util'

export default tokenStream => {
  const { offset, radius, color } = parseShadow(tokenStream)
  return {
    $merge: {
      shadowOffset: offset,
      shadowRadius: radius,
      shadowColor: color,
      shadowOpacity: 1
    }
  }
}
