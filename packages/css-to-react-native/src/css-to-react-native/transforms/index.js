import { regExpToken, tokens } from '../tokenTypes'
import {
  border,
  borderBottom,
  borderColor,
  borderLeft,
  borderRadius,
  borderRight,
  borderTop,
  borderWidth,
} from './border'
import boxShadow from './boxShadow'
import flex from './flex'
import font from './font'
import fontFamily from './fontFamily'
import textDecoration from './textDecoration'
import textDecorationLine from './textDecorationLine'
import textShadow from './textShadow'
import transform from './transform'
import { anyOrderFactory, directionFactory, shadowOffsetFactory } from './util'

const { IDENT, WORD, COLOR, LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT, AUTO } =
  tokens

const background = (tokenStream) => ({
  $merge: { backgroundColor: tokenStream.expect(COLOR) },
})
const margin = directionFactory({
  types: [LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT, AUTO],
  prefix: 'margin',
})
const padding = directionFactory({ prefix: 'padding' })
const flexFlow = anyOrderFactory({
  flexWrap: {
    tokens: [regExpToken(/(nowrap|wrap|wrap-reverse)/)],
    default: 'nowrap',
  },
  flexDirection: {
    tokens: [regExpToken(/(row|row-reverse|column|column-reverse)/)],
    default: 'row',
  },
})
const fontVariant = (tokenStream) => [tokenStream.expect(IDENT)]
const fontWeight = (tokenStream) => tokenStream.expect(WORD) // Also match numbers as strings
const shadowOffset = shadowOffsetFactory()
const textShadowOffset = shadowOffsetFactory()

export default {
  background,
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  borderColor,
  borderRadius,
  borderWidth,
  boxShadow,
  flex,
  flexFlow,
  font,
  fontFamily,
  fontVariant,
  fontWeight,
  margin,
  padding,
  shadowOffset,
  textShadow,
  textShadowOffset,
  textDecoration,
  textDecorationLine,
  transform,
}
