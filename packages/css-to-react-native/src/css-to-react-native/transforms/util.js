import { tokens } from '../tokenTypes'

const { LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT, COLOR, SPACE, NONE } = tokens

export const directionFactory = ({
  types = [LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT],
  directions = ['Top', 'Right', 'Bottom', 'Left'],
  prefix = '',
  suffix = ''
}) => tokenStream => {
  const values = []

  // borderWidth doesn't currently allow a percent value, but may do in the future
  values.push(tokenStream.expect(...types))

  while (values.length < 4 && tokenStream.hasTokens()) {
    tokenStream.expect(SPACE)
    values.push(tokenStream.expect(...types))
  }

  tokenStream.expectEmpty()

  const [top, right = top, bottom = top, left = right] = values

  const keyFor = n => `${prefix}${directions[n]}${suffix}`

  const output = {
    [keyFor(0)]: top,
    [keyFor(1)]: right,
    [keyFor(2)]: bottom,
    [keyFor(3)]: left
  }

  return { $merge: output }
}

export const anyOrderFactory = (properties, delim = SPACE) => tokenStream => {
  const propertyNames = Object.keys(properties)
  const values = propertyNames.reduce((accum, propertyName) => {
    typeof accum[propertyName] === 'undefined'; // eslint-disable-line
    return accum
  }, {})

  let numParsed = 0
  while (numParsed < propertyNames.length && tokenStream.hasTokens()) {
    if (numParsed) tokenStream.expect(delim)

    const matchedPropertyName = propertyNames.find(
      propertyName =>
        typeof values[propertyName] === 'undefined' &&
        properties[propertyName].tokens.some(token =>
          tokenStream.matches(token)
        )
    )

    if (!matchedPropertyName) {
      tokenStream.throw()
    } else {
      values[matchedPropertyName] = tokenStream.lastValue
    }

    numParsed += 1
  }

  tokenStream.expectEmpty()

  propertyNames.forEach(propertyName => {
    if (typeof values[propertyName] === 'undefined') {
      values[propertyName] = properties[propertyName].default
    }
  })

  return { $merge: values }
}

export const shadowOffsetFactory = () => tokenStream => {
  const width = tokenStream.expect(LENGTH)
  const height = tokenStream.matches(SPACE)
    ? tokenStream.expect(LENGTH)
    : width
  tokenStream.expectEmpty()
  return { width, height }
}

export const parseShadow = tokenStream => {
  let offsetX
  let offsetY
  let radius
  let color

  if (tokenStream.matches(NONE)) {
    tokenStream.expectEmpty()
    return {
      offset: { width: 0, height: 0 },
      radius: 0,
      color: 'black'
    }
  }

  let didParseFirst = false
  while (tokenStream.hasTokens()) {
    if (didParseFirst) tokenStream.expect(SPACE)

    if (
      typeof offsetX === 'undefined' &&
      tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT)
    ) {
      offsetX = tokenStream.lastValue
      if (
        tokenStream.matches(SPACE) &&
        tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT)
      ) {
        offsetY = tokenStream.lastValue
      } else {
        offsetY = offsetX
        tokenStream.rewind()
      }

      tokenStream.saveRewindPoint()
      if (
        tokenStream.matches(SPACE) &&
        tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT)
      ) {
        // blur-radius
        radius = tokenStream.lastValue
      } else {
        tokenStream.rewind()
      }
      tokenStream.saveRewindPoint()
      if (
        tokenStream.matches(SPACE) &&
        tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT)
      ) {
        // spread-radius
        // 兼容web写法，防止报错
      } else {
        tokenStream.rewind()
      }
    } else if (typeof color === 'undefined' && tokenStream.matches(COLOR)) {
      color = tokenStream.lastValue
    } else {
      tokenStream.throw()
    }

    didParseFirst = true
  }

  if (typeof offsetX === 'undefined') tokenStream.throw()

  return {
    offset: { width: offsetX, height: offsetY },
    radius: typeof radius !== 'undefined' ? radius : 0,
    color: typeof color !== 'undefined' ? color : 'black'
  }
}
