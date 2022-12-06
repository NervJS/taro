/* eslint-disable react/display-name */
import cssColorKeywords from 'css-color-keywords'
import { stringify } from 'postcss-value-parser'

const matchString = (node) => {
  if (node.type !== 'string') return null
  return node.value
    .replace(/\\([0-9a-f]{1,6})(?:\s|$)/gi, (match, charCode) =>
      String.fromCharCode(parseInt(charCode, 16)),
    )
    .replace(/\\/g, '')
}

const hexColorRe = /^(#(?:[0-9a-f]{3,4}){1,2})$/i
const cssFunctionNameRe = /^(rgba?|hsla?|hwb|lab|lch|gray|color)$/

const matchColor = (node) => {
  if (
    node.type === 'word' &&
    (hexColorRe.test(node.value) ||
      node.value in cssColorKeywords ||
      node.value === 'transparent')
  ) {
    return node.value
  } else if (node.type === 'function' && cssFunctionNameRe.test(node.value)) {
    return stringify(node)
  }
  return null
}

const noneRe = /^(none)$/i
const autoRe = /^(auto)$/i
const identRe = /(^-?[_a-z][_a-z0-9-]*$)/i
// Note if these are wrong, you'll need to change index.js too
const numberRe = /^([+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?)$/
// Note lengthRe is sneaky: you can omit units for 0
const lengthRe = /^(0$|(?:[+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?)((?=px$)|(?=Px$)|(?=PX$)|(?=pX$)|(?=vw$)|(?=vh$)|(?=vmin$)|(?=vmax$)))/
const unsupportedUnitRe = /^([+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?(ch|em|ex|rem|cm|mm|in|pc|pt))$/
const angleRe = /^([+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?(?:deg|rad))$/
const percentRe = /^([+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?%)$/
const viewportUnitRe = /(\d+)(vw|vh|vmin|vmax)/

const noopToken = (predicate) => (node) => predicate(node) ? '<token>' : null

const valueForTypeToken = (type) => (node) =>
  node.type === type ? node.value : null

const functionValueForTypeToken = (type) => (node) => {
  if (node.type === type) {
    // handle rgb(a) function value
    if (/^rgba?$/i.test(node.value)) {
      const result = node.nodes
        .filter((token) => token.type === 'word')
        .map((token) => token.value)

      return `${node.value}(${result.join(', ')})`
    }
  }
  return null
}

export const regExpToken =
  (regExp, transform = String) =>
    (node) => {
      if (node.type !== 'word') return null

      const match = node.value.match(regExp)
      if (match === null) return null

      const value = transform(match[1])
      const unit = node.value.match(viewportUnitRe)?.[2]
      const isViewportUnit = ['vh', 'vw', 'vmin', 'vmax'].includes(unit)

      if (isViewportUnit) {
        return `scaleVu2dp(${value}, '${unit}')`
      } else if (/(\d+)px/.test(node.value)) {
        return `scalePx2dp(${value})`
      } else {
        return value
      }
    }

export const tokens = {
  SPACE: noopToken((node) => node.type === 'space'),
  SLASH: noopToken((node) => node.type === 'div' && node.value === '/'),
  COMMA: noopToken((node) => node.type === 'div' && node.value === ','),
  WORD: valueForTypeToken('word'),
  FUNC: functionValueForTypeToken('function'),
  NONE: regExpToken(noneRe),
  AUTO: regExpToken(autoRe),
  NUMBER: regExpToken(numberRe, Number),
  LENGTH: regExpToken(lengthRe, Number),
  UNSUPPORTED_LENGTH_UNIT: regExpToken(unsupportedUnitRe),
  ANGLE: regExpToken(angleRe),
  PERCENT: regExpToken(percentRe),
  IDENT: regExpToken(identRe),
  STRING: matchString,
  COLOR: matchColor,
  LINE: regExpToken(/^(none|underline|line-through)$/i),
}
