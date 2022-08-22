/* eslint-disable no-param-reassign */
import camelizeStyleName from 'camelize'
import parse from 'postcss-value-parser'

import TokenStream from './TokenStream'
import transforms from './transforms/index'

// Note if this is wrong, you'll need to change tokenTypes.js too
const numberOrLengthRe = /^([+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?)((?:px)|(?:vw$)|(?:vh$)|(?:vmin$)|(?:vmax$))?$/i
const boolRe = /^true|false$/i
const nullRe = /^null$/i
const undefinedRe = /^undefined$/i

// Undocumented export
export const transformRawValue = (input) => {
  const value = input.trim()

  const numberMatch = value.match(numberOrLengthRe)
  if (numberMatch !== null) {
    const num = Number(numberMatch[1])
    const unit = numberMatch[2]
    const isViewportUnit = ['vw', 'vh', 'vmin', 'vmax'].includes(unit)

    if (isViewportUnit) {
      return `scaleVu2dp(${num}, '${unit}')`
    } else if (/(\d+)px/.test(value)) {
      return `scalePx2dp(${num})`
    } else {
      return num
    }
  }

  const boolMatch = input.match(boolRe)
  if (boolMatch !== null) return boolMatch[0].toLowerCase() === 'true'

  const nullMatch = input.match(nullRe)
  if (nullMatch !== null) return null

  const undefinedMatch = input.match(undefinedRe)
  if (undefinedMatch !== null) return undefined

  return value
}

const baseTransformShorthandValue = (propName, inputValue) => {
  // const ast = parse(inputValue.trim().replace(/PX|Px|pX$/g, ""));
  const ast = parse(inputValue)
  const tokenStream = new TokenStream(ast.nodes)
  return transforms[propName](tokenStream)
}

const checkBaseTransformShorthandValue = (propName, inputValue) => {
  try {
    return baseTransformShorthandValue(propName, inputValue)
  } catch (e) {
    throw new Error(
      `${e.message} Failed to parse declaration "${propName}: ${inputValue}"`,
    )
  }
}

const transformShorthandValue =
  process.env.NODE_ENV === 'production'
    ? baseTransformShorthandValue
    : checkBaseTransformShorthandValue

export const getStylesForProperty = (propName, inputValue, allowShorthand) => {
  const isRawValue = allowShorthand === false || !(propName in transforms)
  const propValue = isRawValue
    ? transformRawValue(inputValue)
    : transformShorthandValue(propName, inputValue.trim())
  return propValue && propValue.$merge
    ? propValue.$merge
    : { [propName]: propValue }
}

export const getPropertyName = (propName) => {
  const isCustomProp = /^--\w+/.test(propName)
  if (isCustomProp) {
    return propName
  }
  return camelizeStyleName(propName)
}

export default (rules, shorthandBlacklist = []) =>
  rules.reduce((accum, rule) => {
    const propertyName = getPropertyName(rule[0])
    const value = rule[1]
    const allowShorthand = shorthandBlacklist.indexOf(propertyName) === -1
    return Object.assign(
      accum,
      getStylesForProperty(propertyName, value, allowShorthand),
    )
  }, {})
