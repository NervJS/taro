import { regExpToken, tokens } from '../tokenTypes'
import { directionFactory, anyOrderFactory } from './util'

const {
  WORD,
  COLOR,
  LENGTH,
  UNSUPPORTED_LENGTH_UNIT
} = tokens

function borderDirectionFactory (direction = '') {
  const prefix = `border${direction}`
  return anyOrderFactory({
    [`${prefix}Width`]: {
      tokens: [LENGTH, UNSUPPORTED_LENGTH_UNIT],
      default: 1
    },
    [`${prefix}Color`]: {
      tokens: [COLOR],
      default: 'black'
    },
    [`${prefix}Style`]: {
      tokens: [regExpToken(/^(solid|dashed|dotted)$/)],
      default: 'solid'
    }
  })
}

export const border = borderDirectionFactory()

export const borderTop = borderDirectionFactory('Top')
export const borderRight = borderDirectionFactory('Right')
export const borderBottom = borderDirectionFactory('Bottom')
export const borderLeft = borderDirectionFactory('Left')

export const borderColor = directionFactory({
  types: [WORD],
  prefix: 'border',
  suffix: 'Color'
})

export const borderRadius = directionFactory({
  directions: ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'],
  prefix: 'border',
  suffix: 'Radius'
})

export const borderWidth = directionFactory({ prefix: 'border', suffix: 'Width' })
