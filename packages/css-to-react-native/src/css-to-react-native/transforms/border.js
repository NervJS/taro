import { regExpToken, tokens } from '../tokenTypes'
import { anyOrderFactory, directionFactory } from './util'

const { WORD, FUNC, COLOR, LENGTH, UNSUPPORTED_LENGTH_UNIT } = tokens

function borderDirectionFactory (direction = '') {
  const prefix = `border${direction}`
  return anyOrderFactory({
    [`${prefix}Width`]: {
      tokens: [LENGTH, UNSUPPORTED_LENGTH_UNIT],
      default: 1,
    },
    [`${prefix}Color`]: {
      tokens: [COLOR],
      default: 'black',
    },
    // RN 不支持 borderTopStyle，解析成 borderStyle
    [`borderStyle`]: {
      tokens: [regExpToken(/^(solid|dashed|dotted)$/)],
      default: 'solid',
    },
  })
}

export const border = borderDirectionFactory()

export const borderTop = borderDirectionFactory('Top')
export const borderRight = borderDirectionFactory('Right')
export const borderBottom = borderDirectionFactory('Bottom')
export const borderLeft = borderDirectionFactory('Left')

export const borderColor = directionFactory({
  types: [WORD, FUNC],
  prefix: 'border',
  suffix: 'Color',
})

export const borderRadius = directionFactory({
  directions: ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'],
  prefix: 'border',
  suffix: 'Radius',
})

export const borderWidth = directionFactory({
  prefix: 'border',
  suffix: 'Width',
})
