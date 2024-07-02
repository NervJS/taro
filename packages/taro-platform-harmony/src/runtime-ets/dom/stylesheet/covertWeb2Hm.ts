// @ts-nocheck

import { CSSProperties } from 'react'

import { TaroElement } from '../element/element'
import { BORDER_STYLE_MAP, capitalizeFirstLetter, FlexManager, getNodeMarginOrPaddingData, getUnit } from './util'

// 背景解析正则
const BACKGROUND_REGEX = {
  IMAGE: /url\((['"])?(.*?)\1\)|((linear|radial)-gradient\([^)]*\))/g,
  COLOR: /(#[0-9a-fA-F]{3,8}|rgb\(\d+,\s*\d+,\s*\d+\)|rgba?\(\d+,\s*\d+,\s*\d+,\s*(?:0?\.\d+|\d+%)\)|transparent)/,
  REPEAT: /(repeat-x|repeat-y|repeat|space|round|no-repeat)/,
  POSITION: /(top|left|center|right|bottom|\d+(\.\d+)?(px|%|vw|vh)?)+/g,
  SIZE: /(cover|contain|\d+(\.\d+)?(px|%|vw|vh)?)+/g
}

// Note: 将 web 端的 style 转换为 hm 端的 style
export default function convertWebStyle2HmStyle(webStyle: CSSProperties, node?: TaroElement) {
  const hmStyle: Record<string, any> = node?._st?.hmStyle || {}
  Object.keys(webStyle).forEach((key) => {
    const value = webStyle[key]
    switch (key) {
      case 'padding': {
        const { top, bottom, left, right } = getNodeMarginOrPaddingData(value)
        hmStyle.paddingTop = top
        hmStyle.paddingBottom = bottom
        hmStyle.paddingLeft = left
        hmStyle.paddingRight = right
        break
      }
      case 'paddingTop': {
        hmStyle.paddingTop = getUnit(value)
        break
      }
      case 'paddingBottom': {
        hmStyle.paddingBottom = getUnit(value)
        break
      }
      case 'paddingLeft': {
        hmStyle.paddingLeft = getUnit(value)
        break
      }
      case 'paddingRight': {
        hmStyle.paddingRight = getUnit(value)
        break
      }
      case 'margin': {
        const { top, bottom, left, right } = getNodeMarginOrPaddingData(value)
        hmStyle.marginTop = top
        hmStyle.marginBottom = bottom
        hmStyle.marginLeft = left
        hmStyle.marginRight = right
        break
      }
      case 'marginTop': {
        hmStyle.marginTop = getUnit(value)
        break
      }
      case 'marginBottom': {
        hmStyle.marginBottom = getUnit(value)
        break
      }
      case 'marginLeft': {
        hmStyle.marginLeft = getUnit(value)
        break
      }
      case 'marginRight': {
        hmStyle.marginRight = getUnit(value)
        break
      }
      case 'top': {
        hmStyle.top = getUnit(value)
        break
      }
      case 'left': {
        hmStyle.left = getUnit(value)
        break
      }
      case 'right': {
        hmStyle.right = getUnit(value)
        break
      }
      case 'bottom': {
        hmStyle.bottom = getUnit(value)
        break
      }
      case 'flex': {
        let res: [number, number, number | string] = [0, 0, 'auto']
        if (typeof value === 'number') {
          res = [value, 1, 0]
        } else if (value === 'auto') {
          res = [1, 1, 'auto']
        } else if (value === 'none') {
          res = [0, 0, 'auto']
        } else if (typeof value === 'string') {
          const FlexList = value.replace(new RegExp('/\\s+/g'), ' ').split(' ')
          FlexList.forEach((item, index) => {
            res[index] = index < 2 ? Number(item) : item
          })
        }
        hmStyle.flexGrow = getUnit(res[0])
        hmStyle.flexShrink = Number(res[1])
        hmStyle.flexBasis = Number(res[2])
        break
      }
      case 'flexGrow': {
        hmStyle.flexGrow = getUnit(value)
        break
      }
      case 'flexShrink': {
        hmStyle.flexShrink = Number(value)
        break
      }
      case 'flexBasis': {
        hmStyle.flexBasis = Number(value)
        break
      }
      case 'alignSelf': {
        hmStyle.alignSelf = FlexManager.itemAlign(value)
        break
      }
      case 'flexDirection': {
        hmStyle.flexDirection = FlexManager.direction(value)
        break
      }
      case 'justifyContent': {
        hmStyle.justifyContent = FlexManager.flexAlign(value)
        break
      }
      case 'alignItems': {
        hmStyle.alignItems = FlexManager.itemAlign(value)
        break
      }
      case 'alignContent': {
        hmStyle.alignContent = FlexManager.flexAlign(value)
        break
      }
      case 'flexWrap': {
        hmStyle.flexWrap = FlexManager.flexWrap(value)
        break
      }
      case 'width': {
        hmStyle.width = getUnit(value)
        break
      }
      case 'height': {
        hmStyle.height = getUnit(value)
        break
      }
      case 'minWidth': {
        hmStyle.minWidth = getUnit(value)
        break
      }
      case 'minHeight': {
        hmStyle.minHeight = getUnit(value)
        break
      }
      case 'maxWidth': {
        hmStyle.maxWidth = getUnit(value)
        break
      }
      case 'maxHeight': {
        hmStyle.maxHeight = getUnit(value)
        break
      }
      case 'background': {
        const bg = setBackground(value)
        if (bg['background-color']) { hmStyle.backgroundColor = bg['background-color'] }
        bg['background-image'] && setBackgroundImage(hmStyle, bg['background-image'])
        bg['background-repeat'] && setBackgroundRepeat(hmStyle, bg['background-repeat'])
        bg['background-position'] && setBackgroundPosistion(hmStyle, bg['background-position'])
        bg['background-size'] && setBackgroundSize(hmStyle, bg['background-size'])
        break
      }
      case 'backgroundColor': {
        hmStyle.backgroundColor = value
        break
      }
      case 'backgroundImage': {
        setBackgroundImage(hmStyle, value)
        break
      }
      case 'backgroundRepeat': {
        setBackgroundRepeat(hmStyle, value)
        break
      }
      case 'backgroundSize': {
        setBackgroundSize(hmStyle, value)
        break
      }
      case 'backgroundPosition': {
        setBackgroundPosistion(hmStyle, value)
        break
      }
      case 'border': {
        const [width, style, color] = value.split(' ')
        hmStyle.borderTopWidth = getUnit(width)
        hmStyle.borderRightWidth = getUnit(width)
        hmStyle.borderBottomWidth = getUnit(width)
        hmStyle.borderLeftWidth = getUnit(width)
        hmStyle.borderTopStyle = BORDER_STYLE_MAP.get(style)
        hmStyle.borderRightStyle = BORDER_STYLE_MAP.get(style)
        hmStyle.borderBottomStyle = BORDER_STYLE_MAP.get(style)
        hmStyle.borderLeftStyle = BORDER_STYLE_MAP.get(style)
        hmStyle.borderTopColor = color
        hmStyle.borderRightColor = color
        hmStyle.borderBottomColor = color
        hmStyle.borderLeftColor = color
        break
      }
      case 'borderTop': {
        const [width, style, color] = value.split(' ')
        hmStyle.borderTopWidth = getUnit(width)
        hmStyle.borderTopStyle = BORDER_STYLE_MAP.get(style)
        hmStyle.borderTopColor = color
        break
      }
      case 'borderRight': {
        const [width, style, color] = value.split(' ')
        hmStyle.borderRightWidth = getUnit(width)
        hmStyle.borderRightStyle = BORDER_STYLE_MAP.get(style)
        hmStyle.borderRightColor = color
        break
      }
      case 'borderBottom': {
        const [width, style, color] = value.split(' ')
        hmStyle.borderBottomWidth = getUnit(width)
        hmStyle.borderBottomStyle = BORDER_STYLE_MAP.get(style)
        hmStyle.borderBottomColor = color
        break
      }
      case 'borderLeft': {
        const [width, style, color] = value.split(' ')
        hmStyle.borderLeftWidth = getUnit(width)
        hmStyle.borderLeftStyle = BORDER_STYLE_MAP.get(style)
        hmStyle.borderLeftColor = color
        break
      }
      case 'borderWidth': {
        hmStyle.borderTopWidth = getUnit(value)
        hmStyle.borderRightWidth = getUnit(value)
        hmStyle.borderBottomWidth = getUnit(value)
        hmStyle.borderLeftWidth = getUnit(value)
        break
      }
      case 'borderLeftWidth': {
        hmStyle.borderLeftWidth = getUnit(value)
        break
      }
      case 'borderRightWidth': {
        hmStyle.borderRightWidth = getUnit(value)
        break
      }
      case 'borderTopWidth': {
        hmStyle.borderTopWidth = getUnit(value)
        break
      }
      case 'borderBottomWidth': {
        hmStyle.borderBottomWidth = getUnit(value)
        break
      }
      case 'borderStyle': {
        hmStyle.borderTopStyle = BORDER_STYLE_MAP.get(value)
        hmStyle.borderRightStyle = BORDER_STYLE_MAP.get(value)
        hmStyle.borderBottomStyle = BORDER_STYLE_MAP.get(value)
        hmStyle.borderLeftStyle = BORDER_STYLE_MAP.get(value)
        break
      }
      case 'borderLeftStyle': {
        hmStyle.borderLeftStyle = BORDER_STYLE_MAP.get(value)
        break
      }
      case 'borderRightStyle': {
        hmStyle.borderRightStyle = BORDER_STYLE_MAP.get(value)
        break
      }
      case 'borderTopStyle': {
        hmStyle.borderTopStyle = BORDER_STYLE_MAP.get(value)
        break
      }
      case 'borderBottomStyle': {
        hmStyle.borderBottomStyle = BORDER_STYLE_MAP.get(value)
        break
      }
      case 'borderColor': {
        hmStyle.borderTopColor = value
        hmStyle.borderRightColor = value
        hmStyle.borderBottomColor = value
        hmStyle.borderLeftColor = value
        break
      }
      case 'borderLeftColor': {
        hmStyle.borderLeftColor = value
        break
      }
      case 'borderRightColor': {
        hmStyle.borderRightColor = value
        break
      }
      case 'borderTopColor': {
        hmStyle.borderTopColor = value
        break
      }
      case 'borderBottomColor': {
        hmStyle.borderBottomColor = value
        break
      }
      case 'borderRadius': {
        hmStyle.borderTopLeftRadius = getUnit(value)
        hmStyle.borderTopRightRadius = getUnit(value)
        hmStyle.borderBottomLeftRadius = getUnit(value)
        hmStyle.borderBottomRightRadius = getUnit(value)
        break
      }
      case 'borderTopLeftRadius': {
        hmStyle.borderTopLeftRadius = getUnit(value)
        break
      }
      case 'borderTopRightRadius': {
        hmStyle.borderTopRightRadius = getUnit(value)
        break
      }
      case 'borderBottomLeftRadius': {
        hmStyle.borderBottomLeftRadius = getUnit(value)
        break
      }
      case 'borderBottomRightRadius': {
        hmStyle.borderBottomRightRadius = getUnit(value)
        break
      }
      case 'color': {
        hmStyle.color = value
        break
      }
      case 'fontSize': {
        hmStyle.fontSize = getUnit(value)
        break
      }
      case 'fontWeight': {
        setFontWeight(hmStyle, value)
        break
      }
      case 'fontStyle': {
        switch (value) {
          case 'italic':
            hmStyle.fontStyle = FontStyle.Italic
            break
          default:
            hmStyle.fontStyle = FontStyle.Normal
        }
        break
      }
      case 'textAlign': {
        switch (value) {
          case 'left':
            hmStyle.textAlign = TextAlign.Start
            break
          case 'center':
            hmStyle.textAlign = TextAlign.Center
            break
          case 'right':
            hmStyle.textAlign = TextAlign.End
            break
          default:
            hmStyle.textAlign = TextAlign.Start
            break
        }
        break
      }
      case 'verticalAlign': {
        switch (value) {
          case 'supper':
          case 'top':
          case 'text-top':
            hmStyle.verticalAlign = Alignment.Top
            break
          case 'middle':
            hmStyle.verticalAlign = Alignment.Center
            break
          case 'sub':
          case 'text-bottom':
          case 'bottom':
            hmStyle.verticalAlign = Alignment.Bottom
            break
        }
        break
      }
      case 'lineHeight': {
        hmStyle.lineHeight = getUnit(value)
        break
      }
      case 'letterSpacing': {
        hmStyle.letterSpacing = getUnit(value)
        break
      }
      case 'textDecoration': {
        if (typeof value === 'string') {
          switch (value) {
            case 'underline': hmStyle.textDecoration = { type: TextDecorationType.Underline }; break
            case 'overline': hmStyle.textDecoration = { type: TextDecorationType.Overline }; break
            case 'line-through': hmStyle.textDecoration = { type: TextDecorationType.LineThrough }; break
            default: hmStyle.textDecoration = { type: TextDecorationType.None }; break
          }
        }
        break
      }
      case 'textOverflow': {
        if (typeof value === 'string') {
          let overflow = TextOverflow.None
          switch (value) {
            case 'clip': overflow = TextOverflow.Clip; break
            case 'ellipsis': overflow = TextOverflow.Ellipsis; break
            case 'marquee': overflow = TextOverflow.MARQUEE; break
          }
          hmStyle.textOverflow = {
            overflow
          }
        }
        break
      }
      case 'WebkitLineClamp': {
        hmStyle.WebkitLineClamp = Number(value)
        break
      }
      case 'transform': {
        hmStyle.transform = parseTransform(value)
        break
      }
      case 'transformOrigin': {
        hmStyle.transformOrigin = parseTransformOrigin(value)
        break
      }
      case 'position': {
        hmStyle.position = value
        break
      }
      case 'display': {
        hmStyle.display = value
        break
      }
      case 'zIndex': {
        hmStyle.zIndex = Number(value)
        break
      }
      case 'opacity': {
        const val = Number(value)
        hmStyle.opacity = Number.isNaN(val) ? 1 : val
        break
      }
      case 'overflow': {
        if (value === 'auto') {
          hmStyle.overflow = 'scroll'
        } else {
          hmStyle.overflow = value
        }
        break
      }
      case 'animation': {
        // TODO：不支持解析Style上的动画参数
        break
      }
      default: {
        hmStyle[key] = value
        break
      }
    }
  })
  return hmStyle
}

function setBackgroundImage(hmStyle, value) {
  if (typeof value === 'string') {
    if (value.indexOf('url(') !== -1 && value.indexOf(')') !== -1) {
      // 如果包含 url()，则说明是 background-image 属性
      const match = value.match(new RegExp('url\\([\'"]?(.*?)[\'"]?\\)'))
      if (match) {
        hmStyle.backgroundImage = {
          src: match[1]
        }
      }
    } else if (value.indexOf('linear-gradient(') !== -1) {
      hmStyle.backgroundImage = parseGradient(value)
    }
  }
}

// 解析background属性
function setBackground (backgroundValue: string) {
  backgroundValue = preprocessCss(backgroundValue)
  const result = {
    'background-color': '',
    'background-image': '',
    'background-repeat': '',
    'background-position': '',
    'background-size': ''
  }

  if (!backgroundValue) return result

  // 匹配background-image
  const imageMatch = backgroundValue.match(BACKGROUND_REGEX.IMAGE)
  if (imageMatch) {
    result['background-image'] = imageMatch[0]
    backgroundValue = backgroundValue.replace(imageMatch[0], '').trim()
  }

  // 匹配background-color
  const colorMatch = backgroundValue.match(BACKGROUND_REGEX.COLOR)
  if (colorMatch) {
    result['background-color'] = colorMatch[0]
    backgroundValue = backgroundValue.replace(colorMatch[0], '').trim()
  }

  // 匹配background-repeat
  const repeatMatch = backgroundValue.match(BACKGROUND_REGEX.REPEAT)
  if (repeatMatch) {
    result['background-repeat'] = repeatMatch[0]
    backgroundValue = backgroundValue.replace(repeatMatch[0], '').trim()
  }

  // 匹配background-position,background-size
  // 先分割 / 分割出background-position\background-size
  const positionSize = backgroundValue.split('/')
  const [position, size] = positionSize
  // 匹配background-position
  if (position) {
    const positionMatch = position.match(BACKGROUND_REGEX.POSITION)
    if (positionMatch) {
      result['background-position'] = positionMatch.join(' ')
    }
  }
  if (size) {
    // 匹配background-size
    const sizeMatch = size.match(BACKGROUND_REGEX.SIZE)
    if (sizeMatch) {
      result['background-size'] = sizeMatch.join(' ')
    }
  }

  return result
}

function setBackgroundRepeat(hmStyle, value) {
  if (typeof value === 'string') {
    switch (value) {
      case 'repeat-x': hmStyle.backgroundRepeat = ImageRepeat.X; break
      case 'repeat-y': hmStyle.backgroundRepeat = ImageRepeat.Y; break
      case 'no-repeat': hmStyle.backgroundRepeat = ImageRepeat.NoRepeat; break
      default: hmStyle.backgroundRepeat = ImageRepeat.XY; break
    }
  }
}

function setBackgroundSize(hmStyle, value) {
  if (typeof value === 'string') {
    if (value === 'cover') {
      hmStyle.backgroundSize = ImageSize.Cover
      return
    } else if (value === 'contain') {
      hmStyle.backgroundSize = ImageSize.Contain
      return
    }
    const sizes = value.split(' ')
    if (sizes.length === 1) {
      hmStyle.backgroundSize = { width: getUnit(sizes[0]) }
    } else if (sizes.length === 2) {
      hmStyle.backgroundSize = { width: getUnit(sizes[0]), height: getUnit(sizes[1]) }
    }
  }
}

function setBackgroundPosistion (hmStyle, value) {
  if (typeof value === 'string') {
    const positions = value.split(' ')
    const horizontal = positions[0].toLowerCase()
    const vertical = positions[1]?.toLowerCase() || 'top'

    if (horizontal === 'left' && vertical === 'top') {
      hmStyle.backgroundPosition = Alignment.TopStart
    } else if (horizontal === 'center' && vertical === 'top') {
      hmStyle.backgroundPosition = Alignment.Top
    } else if (horizontal === 'right' && vertical === 'top') {
      hmStyle.backgroundPosition = Alignment.TopEnd
    } else if (horizontal === 'left' && vertical === 'center') {
      hmStyle.backgroundPosition = Alignment.Start
    } else if (horizontal === 'center' && vertical === 'center') {
      hmStyle.backgroundPosition = Alignment.Center
    } else if (horizontal === 'right' && vertical === 'center') {
      hmStyle.backgroundPosition = Alignment.End
    } else if (horizontal === 'left' && vertical === 'bottom') {
      hmStyle.backgroundPosition = Alignment.BottomStart
    } else if (horizontal === 'center' && vertical === 'bottom') {
      hmStyle.backgroundPosition = Alignment.Bottom
    } else if (horizontal === 'right' && vertical === 'bottom') {
      hmStyle.backgroundPosition = Alignment.BottomEnd
    } else {
      if (/^-?\d+(\.\d+)?(px|%|vw|vh)$/.test(horizontal)) {
        hmStyle.backgroundPosition = { x: getUnit(horizontal) }
        if (/^-?\d+(\.\d+)?(px|%|vw|vh)$/.test(vertical)) {
          hmStyle.backgroundPosition = { x: getUnit(horizontal), y: getUnit(vertical) }
        }
      }
    }
  }
}

function setFontWeight (hmStyle, value) {
  switch (value) {
    case 'normal': hmStyle.fontWeight = FontWeight.Normal; break
    case 'bold': hmStyle.fontWeight = FontWeight.Bold; break
    case 'bolder': hmStyle.fontWeight = FontWeight.Bolder; break
    case 'lighter': hmStyle.fontWeight = FontWeight.Lighter; break
    default: hmStyle.fontWeight = Number(value); break
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseTransform(transformString) {
  const transformRegex = /(\w+)\(([^)]+)\)/g
  const transform = {}

  let matchs
  while ((matchs = transformRegex.exec(transformString)) !== null) {
    const [, type, valueString] = matchs
    const values = valueString.split(/\s*,\s*/)

    const transformObj = {
      type: capitalizeFirstLetter(type),
      value: {}
    }

    switch (type) {
      case 'translate':
      case 'translate3d':
        transformObj.value.x = (getUnit(values[0])) || 0
        transformObj.value.y = (getUnit(values[1])) || 0
        transformObj.value.z = (getUnit(values[2])) || 0
        break
      case 'translateX':
        transformObj.value.x = (getUnit(values[0])) || 0
        break
      case 'translateY':
        transformObj.value.y = (getUnit(values[0])) || 0
        break
      case 'translateZ':
        transformObj.value.z = (getUnit(values[0])) || 0
        break
      case 'rotate':
      case 'rotateZ':
        transformObj.value.angle = (getUnit(values[0])) || 0
        transformObj.value.x = 0
        transformObj.value.y = 0
        transformObj.value.z = 1
        break
      case 'rotate3d':
        transformObj.value.angle = getUnit(values[0]) || 0
        transformObj.value.x = values[1] || 0
        transformObj.value.y = values[2] || 0
        transformObj.value.z = values[3] || 0
        break
      case 'rotateX':
        transformObj.value.angle = getUnit(values[0]) || 0
        transformObj.value.x = 1
        transformObj.value.y = 0
        transformObj.value.z = 0
        break
      case 'rotateY':
        transformObj.value.angle = getUnit(values[0]) || 0
        transformObj.value.x = 0
        transformObj.value.y = 1
        transformObj.value.z = 0
        break
      case 'scale':
      case 'scale3d':
        transformObj.value.x = parseFloat(values[0]) || 1
        transformObj.value.y = parseFloat(values[1] || values[0]) || 1
        transformObj.value.z = parseFloat(values[2]) || 1
        break
      case 'scaleX':
        transformObj.value.x = parseFloat(values[0]) || 1
        break
      case 'scaleY':
        transformObj.value.y = parseFloat(values[0]) || 1
        break
      default:
        // Handle unrecognized transform types or ignore them
        break
    }

    transform[transformObj.type] = transformObj.value
  }

  return transform
}

// 方向转百分比
function directionToPercent(direction: string) {
  switch (direction) {
    case 'top':
    case 'left':
      return '0%'
    case 'center':
      return '50%'
    case 'bottom':
    case 'right':
      return '100%'
    default:
      return direction
  }
}

// 解析transform-orgin
function parseTransformOrigin (value: string) {
  if (typeof value === 'string') {
    const values = value.split(' ')
    if (values.length === 1) {
      return {
        x: getUnit(directionToPercent(values[0])),
        y: getUnit(directionToPercent(values[0]))
      }
    } else if (values.length === 2) {
      return {
        x: getUnit(directionToPercent(values[0])),
        y: getUnit(directionToPercent(values[1]))
      }
    }
  }
  return {
    x: 0,
    y: 0
  }
}

function directionToAngle(direction) {
  const map = {
    'to top': 270,
    'to bottom': 90,
    'to left': 180,
    'to right': 0,
    'to top left': 225,
    'to left top': 225,
    'to top right': 315,
    'to right top': 315,
    'to bottom left': 135,
    'to left bottom': 135,
    'to bottom right': 45,
    'to right bottom': 45
  }
  return map[direction.toLowerCase()] || 0 // 默认为0度（to right）
}

function parseGradient(gradientString) {
  const directionPattern = /linear-gradient\((to [a-z ]+|\d+deg),/
  const directionMatch = gradientString.match(directionPattern)
  let angle

  if (directionMatch) {
    const direction = directionMatch[1]
    if (direction.includes('deg')) {
      angle = parseInt(direction, 10)
    } else {
      angle = directionToAngle(direction)
    }
  } else {
    angle = 0 // 默认方向为向右（0度）
  }
  const colorPattern = /(?:(#[0-9a-f]{3,8}|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*\d*\.?\d+\s*)?\)))\s*(\d*%|)/gi
  const colors = []
  let match
  while ((match = colorPattern.exec(gradientString)) !== null) {
    const color = match[1] ? match[1].trim() : null
    const position = match[2] ? parseInt(match[2], 10) / 100 : null
    colors.push([color, position])
  }

  if (colors.some(color => color[1] === null)) {
    const step = 1 / (colors.length - 1)
    colors.forEach((color, index) => (color[1] = index * step))
  }

  return {
    angle: angle,
    colors: colors
  }
}

function rgbaToHex(rgba) {
  const parts = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)/)
  if (!parts) return rgba // 如果匹配失败，返回原字符串

  const r = parseInt(parts[1]).toString(16).padStart(2, '0')
  const g = parseInt(parts[2]).toString(16).padStart(2, '0')
  const b = parseInt(parts[3]).toString(16).padStart(2, '0')
  if (parts[4]) {
    const a = parts[4] ? Math.round(parseFloat(parts[4]) * 255).toString(16).padStart(2, '0') : 'ff'
    return `#${a}${r}${g}${b}`
  } else {
    return `#${r}${g}${b}`
  }
}
function preprocessCss(css) {
  return css.replace(/rgba?\((\d+\s*,\s*\d+\s*,\s*\d+\s*,?\s*\d*\.?\d*)\)/g, (match) => {
    return rgbaToHex(match)
  })
}
