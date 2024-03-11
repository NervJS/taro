// @ts-nocheck

import { CSSProperties } from 'react'

import { BORDER_STYLE_MAP, capitalizeFirstLetter, FlexManager, getNodeMarginOrPaddingData, getUnit } from './util'

// 将web端的style转换为hm端的style
export default function convertWebStyle2HmStyle(webStyle: CSSProperties) {
  const hmStyle: Record<string, any> = {}
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
        // TODO： 暂未实现
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
            case 'underline': hmStyle.textDecoration = TextDecorationType.Underline; break
            case 'overline': hmStyle.textDecoration = TextDecorationType.Overline; break
            case 'line-through': hmStyle.textDecoration = TextDecorationType.LineThrough; break
            default: hmStyle.textDecoration = TextDecorationType.None; break
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
        // todo: 需要更新
        // hmStyle.transform = parseTransform(value)
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
        hmStyle.overflow = value
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
  if (typeof value === 'string' && value.indexOf('url(') !== -1 && value.indexOf(')') !== -1) {
    // 如果包含 url()，则说明是 background-image 属性
    const match = value.match(new RegExp('url\\([\'"]?(.*?)[\'"]?\\)'))
    if (match) {
      hmStyle.backgroundImage = {
        src: match[1]
      }
    }
  }
  // todo 渐变需要处理
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
    const vertical = positions[1].toLowerCase() || 'top'

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
      if (/^\d+(\.\d+)?(px|%|vw|vh)$/.test(horizontal)) {
        hmStyle.backgroundPosition = { x: getUnit(horizontal) }
        if (/^\d+(\.\d+)?(px|%|vw|vh)$/.test(vertical)) {
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
  const transforms = []

  let matchs
  while ((matchs = transformRegex.exec(transformString)) !== null) {
    const [, type, valueString] = matchs
    const values = valueString.split(/\s*,\s*/).map(parseFloat)

    const transformObj = {
      type: capitalizeFirstLetter(type),
      value: {}
    }

    switch (type) {
      case 'translate':
      case 'translate3d':
        transformObj.value.x = parseFloat(getUnit(values[0])) || 0
        transformObj.value.y = parseFloat(getUnit(values[1])) || 0
        transformObj.value.z = parseFloat(getUnit(values[2])) || 0
        break
      case 'translateX':
        transformObj.value.x = parseFloat(getUnit(values[0])) || 0
        break
      case 'translateY':
        transformObj.value.y = parseFloat(getUnit(values[0])) || 0
        break
      case 'translateZ':
        transformObj.value.z = parseFloat(getUnit(values[0])) || 0
        break
      case 'rotate':
        transformObj.value.angle = parseFloat(getUnit(values[0])) || 0
        transformObj.value.x = 0
        transformObj.value.y = 0
        transformObj.value.z = 1
        break
      case 'rotate3d':
        transformObj.value.angle = parseFloat(getUnit(values[0])) || 0
        transformObj.value.x = values[1] || 0
        transformObj.value.y = values[2] || 0
        transformObj.value.z = values[3] || 0
        break
      case 'rotateX':
        transformObj.value.angle = parseFloat(getUnit(values[0])) || 0
        transformObj.value.x = 1
        transformObj.value.y = 0
        transformObj.value.z = 0
        break
      case 'rotateY':
        transformObj.value.angle = parseFloat(getUnit(values[0])) || 0
        transformObj.value.x = 0
        transformObj.value.y = 1
        transformObj.value.z = 0
        break
      case 'scale':
      case 'scale3d':
        transformObj.value.x = values[0] || 1
        transformObj.value.y = values[1] || values[0] || 1
        transformObj.value.z = values[2] || 1
        break
      case 'scaleX':
        transformObj.value.x = values[0] || 1
        break
      case 'scaleY':
        transformObj.value.y = values[0] || 1
        break
      default:
        // Handle unrecognized transform types or ignore them
        break
    }

    transforms.push(transformObj)
  }

  return transforms
}
