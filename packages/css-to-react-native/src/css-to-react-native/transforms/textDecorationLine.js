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
