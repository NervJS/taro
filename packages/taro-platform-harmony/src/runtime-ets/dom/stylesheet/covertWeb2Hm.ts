// @ts-nocheck

import { CSSProperties } from 'react'

import { BORDER_STYLE_MAP, capitalizeFirstLetter, FlexManager, getNodeMarginOrPaddingData, getUnit } from './util'

export const WEB_STYLE_MAP = {
  padding: ['_paddingTop', '_paddingRight', '_paddingBottom', '_paddingLeft'],
  paddingTop: ['_paddingTop'],
  paddingRight: ['_paddingRight'],
  paddingBottom: ['_paddingBottom'],
  paddingLeft: ['_paddingLeft'],
  margin: ['_marginTop', '_marginRight', '_marginBottom', '_marginLeft'],
  marginTop: ['_marginTop'],
  marginRight: ['_marginRight'],
  marginBottom: ['_marginBottom'],
  marginLeft: ['_marginLeft'],
  top: ['_top'],
  left: ['_left'],
  flex: ['_flexGrow', '_flexShrink', '_flexBasis'],
  flexGrow: ['_flexGrow'],
  flexShrink: ['_flexShrink'],
  flexBasis: ['_flexBasis'],
  alignSelf: ['_alignSelf'],
  flexDirection: ['_flexDirection'],
  justifyContent: ['_justifyContent'],
  alignItems: ['_alignItems'],
  alignContent: ['_alignContent'],
  flexWrap: ['_flexWrap'],
  width: ['_width'],
  height: ['_height'],
  minWidth: ['_minWidth'],
  minHeight: ['_minHeight'],
  maxWidth: ['_maxWidth'],
  maxHeight: ['_maxHeight'],
  background: ['_backgroundColor', '_backgroundImage', '_backgroundRepeat', '_backgroundSize', '_backgroundPosition'],
  backgroundColor: ['_backgroundColor'],
  backgroundImage: ['_backgroundImage'],
  backgroundRepeat: ['_backgroundRepeat'],
  backgroundSize: ['_backgroundSize'],
  backgroundPosition: ['_backgroundPosition'],
  border: ['_borderTopWidth', '_borderRightWidth', '_borderBottomWidth', '_borderLeftWidth', '_borderTopStyle', '_borderRightStyle', '_borderBottomStyle', '_borderLeftStyle', '_borderTopColor', '_borderRightColor', '_borderBottomColor', '_borderLeftColor'],
  borderTop: ['_borderTopWidth', '_borderTopStyle', '_borderTopColor'],
  borderRight: ['_borderRightWidth', '_borderRightStyle', '_borderRightColor'],
  borderBottom: ['_borderBottomWidth', '_borderBottomStyle', '_borderBottomColor'],
  borderLeft: ['_borderLeftWidth', '_borderLeftStyle', '_borderLeftColor'],
  borderWidth: ['_borderTopWidth', '_borderRightWidth', '_borderBottomWidth', '_borderLeftWidth'],
  borderLeftWidth: ['_borderLeftWidth'],
  borderRightWidth: ['_borderRightWidth'],
  borderTopWidth: ['_borderTopWidth'],
  borderBottomWidth: ['_borderBottomWidth'],
  borderStyle: ['_borderTopStyle', '_borderRightStyle', '_borderBottomStyle', '_borderLeftStyle'],
  borderLeftStyle: ['_borderLeftStyle'],
  borderRightStyle: ['_borderRightStyle'],
  borderTopStyle: ['_borderTopStyle'],
  borderBottomStyle: ['_borderBottomStyle'],
  borderColor: ['_borderTopColor', '_borderRightColor', '_borderBottomColor', '_borderLeftColor'],
  borderLeftColor: ['_borderLeftColor'],
  borderRightColor: ['_borderRightColor'],
  borderTopColor: ['_borderTopColor'],
  borderBottomColor: ['_borderBottomColor'],
  borderRadius: ['_borderTopLeftRadius', '_borderTopRightRadius', '_borderBottomLeftRadius', '_borderBottomRightRadius'],
  borderTopLeftRadius: ['_borderTopLeftRadius'],
  borderTopRightRadius: ['_borderTopRightRadius'],
  borderBottomLeftRadius: ['_borderBottomLeftRadius'],
  borderBottomRightRadius: ['_borderBottomRightRadius'],
  color: ['_color'],
  fontSize: ['_fontSize'],
  fontWeight: ['_fontWeight'],
  fontStyle: ['_fontStyle'],
  textAlign: ['_textAlign'],
  lineHeight: ['_lineHeight'],
  letterSpacing: ['_letterSpacing'],
  textDecoration: ['_textDecoration'],
  textOverflow: ['_textOverflow'],
  WebkitLineClamp: ['_WebkitLineClamp'],
  transform: ['_transform']
}

// 将web端的style转换为hm端的style
export default function convertWebStyle2HmStyle(webStyle: CSSProperties) {
  const hmStyle: Record<string, any> = {}
  Object.keys(webStyle).forEach((key) => {
    const value = webStyle[key]
    switch (key) {
      case 'padding': {
        const { top, bottom, left, right } = getNodeMarginOrPaddingData(value)
        hmStyle._paddingTop = top
        hmStyle._paddingBottom = bottom
        hmStyle._paddingLeft = left
        hmStyle._paddingRight = right
        break
      }
      case 'paddingTop': {
        hmStyle._paddingTop = getUnit(value)
        break
      }
      case 'paddingBottom': {
        hmStyle._paddingBottom = getUnit(value)
        break
      }
      case 'paddingLeft': {
        hmStyle._paddingLeft = getUnit(value)
        break
      }
      case 'paddingRight': {
        hmStyle._paddingRight = getUnit(value)
        break
      }
      case 'margin': {
        const { top, bottom, left, right } = getNodeMarginOrPaddingData(value)
        hmStyle._marginTop = top
        hmStyle._marginBottom = bottom
        hmStyle._marginLeft = left
        hmStyle._marginRight = right
        break
      }
      case 'marginTop': {
        hmStyle._marginTop = getUnit(value)
        break
      }
      case 'marginBottom': {
        hmStyle._marginBottom = getUnit(value)
        break
      }
      case 'marginLeft': {
        hmStyle._marginLeft = getUnit(value)
        break
      }
      case 'marginRight': {
        hmStyle._marginRight = getUnit(value)
        break
      }
      case 'top': {
        hmStyle._top = getUnit(value)
        break
      }
      case 'left': {
        hmStyle._left = getUnit(value)
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
        hmStyle._flexGrow = getUnit(res[0])
        hmStyle._flexShrink = Number(res[1])
        hmStyle._flexBasis = Number(res[2])
        break
      }
      case 'flexGrow': {
        hmStyle._flexGrow = getUnit(value)
        break
      }
      case 'flexShrink': {
        hmStyle._flexShrink = Number(value)
        break
      }
      case 'flexBasis': {
        hmStyle._flexBasis = Number(value)
        break
      }
      case 'alignSelf': {
        hmStyle._alignSelf = FlexManager.itemAlign(value)
        break
      }
      case 'flexDirection': {
        hmStyle._flexDirection = FlexManager.direction(value)
        break
      }
      case 'justifyContent': {
        hmStyle._justifyContent = FlexManager.flexAlign(value)
        break
      }
      case 'alignItems': {
        hmStyle._alignItems = FlexManager.itemAlign(value)
        break
      }
      case 'alignContent': {
        hmStyle._alignContent = FlexManager.flexAlign(value)
        break
      }
      case 'flexWrap': {
        hmStyle._flexWrap = FlexManager.flexWrap(value)
        break
      }
      case 'width': {
        hmStyle._width = getUnit(value)
        break
      }
      case 'height': {
        hmStyle._height = getUnit(value)
        break
      }
      case 'minWidth': {
        hmStyle._minWidth = getUnit(value)
        break
      }
      case 'minHeight': {
        hmStyle._minHeight = getUnit(value)
        break
      }
      case 'maxWidth': {
        hmStyle._maxWidth = getUnit(value)
        break
      }
      case 'maxHeight': {
        hmStyle._maxHeight = getUnit(value)
        break
      }
      case 'background': {
        // TODO： 暂未实现
        break
      }
      case 'backgroundColor': {
        hmStyle._backgroundColor = value
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
        hmStyle._borderTopWidth = getUnit(width)
        hmStyle._borderRightWidth = getUnit(width)
        hmStyle._borderBottomWidth = getUnit(width)
        hmStyle._borderLeftWidth = getUnit(width)
        hmStyle._borderTopStyle = BORDER_STYLE_MAP.get(style)
        hmStyle._borderRightStyle = BORDER_STYLE_MAP.get(style)
        hmStyle._borderBottomStyle = BORDER_STYLE_MAP.get(style)
        hmStyle._borderLeftStyle = BORDER_STYLE_MAP.get(style)
        hmStyle._borderTopColor = color
        hmStyle._borderRightColor = color
        hmStyle._borderBottomColor = color
        hmStyle._borderLeftColor = color
        break
      }
      case 'borderTop': {
        const [width, style, color] = value.split(' ')
        hmStyle._borderTopWidth = getUnit(width)
        hmStyle._borderTopStyle = BORDER_STYLE_MAP.get(style)
        hmStyle._borderTopColor = color
        break
      }
      case 'borderRight': {
        const [width, style, color] = value.split(' ')
        hmStyle._borderRightWidth = getUnit(width)
        hmStyle._borderRightStyle = BORDER_STYLE_MAP.get(style)
        hmStyle._borderRightColor = color
        break
      }
      case 'borderBottom': {
        const [width, style, color] = value.split(' ')
        hmStyle._borderBottomWidth = getUnit(width)
        hmStyle._borderBottomStyle = BORDER_STYLE_MAP.get(style)
        hmStyle._borderBottomColor = color
        break
      }
      case 'borderLeft': {
        const [width, style, color] = value.split(' ')
        hmStyle._borderLeftWidth = getUnit(width)
        hmStyle._borderLeftStyle = BORDER_STYLE_MAP.get(style)
        hmStyle._borderLeftColor = color
        break
      }
      case 'borderWidth': {
        hmStyle._borderTopWidth = getUnit(value)
        hmStyle._borderRightWidth = getUnit(value)
        hmStyle._borderBottomWidth = getUnit(value)
        hmStyle._borderLeftWidth = getUnit(value)
        break
      }
      case 'borderLeftWidth': {
        hmStyle._borderLeftWidth = getUnit(value)
        break
      }
      case 'borderRightWidth': {
        hmStyle._borderRightWidth = getUnit(value)
        break
      }
      case 'borderTopWidth': {
        hmStyle._borderTopWidth = getUnit(value)
        break
      }
      case 'borderBottomWidth': {
        hmStyle._borderBottomWidth = getUnit(value)
        break
      }
      case 'borderStyle': {
        hmStyle._borderTopStyle = BORDER_STYLE_MAP.get(value)
        hmStyle._borderRightStyle = BORDER_STYLE_MAP.get(value)
        hmStyle._borderBottomStyle = BORDER_STYLE_MAP.get(value)
        hmStyle._borderLeftStyle = BORDER_STYLE_MAP.get(value)
        break
      }
      case 'borderLeftStyle': {
        hmStyle._borderLeftStyle = BORDER_STYLE_MAP.get(value)
        break
      }
      case 'borderRightStyle': {
        hmStyle._borderRightStyle = BORDER_STYLE_MAP.get(value)
        break
      }
      case 'borderTopStyle': {
        hmStyle._borderTopStyle = BORDER_STYLE_MAP.get(value)
        break
      }
      case 'borderBottomStyle': {
        hmStyle._borderBottomStyle = BORDER_STYLE_MAP.get(value)
        break
      }
      case 'borderColor': {
        hmStyle._borderTopColor = value
        hmStyle._borderRightColor = value
        hmStyle._borderBottomColor = value
        hmStyle._borderLeftColor = value
        break
      }
      case 'borderLeftColor': {
        hmStyle._borderLeftColor = value
        break
      }
      case 'borderRightColor': {
        hmStyle._borderRightColor = value
        break
      }
      case 'borderTopColor': {
        hmStyle._borderTopColor = value
        break
      }
      case 'borderBottomColor': {
        hmStyle._borderBottomColor = value
        break
      }
      case 'borderRadius': {
        hmStyle._borderTopLeftRadius = getUnit(value)
        hmStyle._borderTopRightRadius = getUnit(value)
        hmStyle._borderBottomLeftRadius = getUnit(value)
        hmStyle._borderBottomRightRadius = getUnit(value)
        break
      }
      case 'borderTopLeftRadius': {
        hmStyle._borderTopLeftRadius = getUnit(value)
        break
      }
      case 'borderTopRightRadius': {
        hmStyle._borderTopRightRadius = getUnit(value)
        break
      }
      case 'borderBottomLeftRadius': {
        hmStyle._borderBottomLeftRadius = getUnit(value)
        break
      }
      case 'borderBottomRightRadius': {
        hmStyle._borderBottomRightRadius = getUnit(value)
        break
      }
      case 'color': {
        hmStyle._color = value
        break
      }
      case 'fontSize': {
        hmStyle._fontSize = getUnit(value)
        break
      }
      case 'fontWeight': {
        setFontWeight(hmStyle, value)
        break
      }
      case 'fontStyle': {
        switch (value) {
          case 'italic':
            hmStyle._fontStyle = FontStyle.Italic
            break
          default:
            hmStyle._fontStyle = FontStyle.Normal
        }
        break
      }
      case 'textAlign': {
        switch (value) {
          case 'left':
            hmStyle._textAlign = TextAlign.Start
            break
          case 'center':
            hmStyle._textAlign = TextAlign.Center
            break
          case 'right':
            hmStyle._textAlign = TextAlign.End
            break
          default:
            hmStyle._textAlign = TextAlign.Start
            break
        }
        break
      }
      case 'lineHeight': {
        hmStyle._lineHeight = getUnit(value)
        break
      }
      case 'letterSpacing': {
        hmStyle._letterSpacing = getUnit(value)
        break
      }
      case 'textDecoration': {
        if (typeof value === 'string') {
          switch (value) {
            case 'underline': hmStyle._textDecoration = TextDecorationType.Underline; break
            case 'overline': hmStyle._textDecoration = TextDecorationType.Overline; break
            case 'line-through': hmStyle._textDecoration = TextDecorationType.LineThrough; break
            default: hmStyle._textDecoration = TextDecorationType.None; break
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
          hmStyle._textOverflow = {
            overflow
          }
        }
        break
      }
      case 'WebkitLineClamp': {
        hmStyle._WebkitLineClamp = Number(value)
        break 
      }
      case 'transform': {
        hmStyle._transform = parseTransform(value)
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
      hmStyle._backgroundImage = [{
        src: match[1]
      }]
    }
  }
}

function setBackgroundRepeat(hmStyle, value) {
  if (typeof value === 'string') {
    switch (value) {
      case 'repeat-x': hmStyle._backgroundRepeat = [ImageRepeat.X]; break
      case 'repeat-y': hmStyle._backgroundRepeat = [ImageRepeat.Y]; break
      case 'no-repeat': hmStyle._backgroundRepeat = [ImageRepeat.NoRepeat]; break
      default: hmStyle._backgroundRepeat = [ImageRepeat.XY]; break
    }
  }
}

function setBackgroundSize(hmStyle, value) {
  if (typeof value === 'string') {
    const sizes = value.split(' ')
    if (sizes.length === 1) {
      hmStyle._backgroundSize = [{ width: getUnit(sizes[0]) }]
    } else if (sizes.length === 2) {
      hmStyle._backgroundSize = [{ width: getUnit(sizes[0]), height: getUnit(sizes[1]) }]
    }
  }
}

function setBackgroundPosistion (hmStyle, value) {
  if (typeof value === 'string') {
    const positions = value.split(' ')
    const horizontal = positions[0].toLowerCase()
    const vertical = positions[1].toLowerCase() || 'top'

    if (horizontal === 'left' && vertical === 'top') {
      hmStyle._backgroundPosition = [Alignment.TopStart]
    } else if (horizontal === 'center' && vertical === 'top') {
      hmStyle._backgroundPosition = [Alignment.Top]
    } else if (horizontal === 'right' && vertical === 'top') {
      hmStyle._backgroundPosition = [Alignment.TopEnd]
    } else if (horizontal === 'left' && vertical === 'center') {
      hmStyle._backgroundPosition = [Alignment.Start]
    } else if (horizontal === 'center' && vertical === 'center') {
      hmStyle._backgroundPosition = [Alignment.Center]
    } else if (horizontal === 'right' && vertical === 'center') {
      hmStyle._backgroundPosition = [Alignment.End]
    } else if (horizontal === 'left' && vertical === 'bottom') {
      hmStyle._backgroundPosition = [Alignment.BottomStart]
    } else if (horizontal === 'center' && vertical === 'bottom') {
      hmStyle._backgroundPosition = [Alignment.Bottom]
    } else if (horizontal === 'right' && vertical === 'bottom') {
      hmStyle._backgroundPosition = [Alignment.BottomEnd]
    } else {
      if (/^\d+(\.\d+)?(px|%|vw|vh)$/.test(horizontal)) {
        hmStyle._backgroundPosition = [{ x: getUnit(horizontal) }]
        if (/^\d+(\.\d+)?(px|%|vw|vh)$/.test(vertical)) {
          hmStyle._backgroundPosition = [{ x: getUnit(horizontal), y: getUnit(vertical) }]
        }
      }
    }
  }
}

function setFontWeight (hmStyle, value) {
  switch (value) {
    case 'normal': hmStyle._fontWeight = FontWeight.Normal; break
    case 'bold': hmStyle._fontWeight = FontWeight.Bold; break
    case 'bolder': hmStyle._fontWeight = FontWeight.Bolder; break
    case 'lighter': hmStyle._fontWeight = FontWeight.Lighter; break
    default: hmStyle._fontWeight = Number(value); break
  }
}

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
