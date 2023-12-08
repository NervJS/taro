import { isNumber } from '@tarojs/shared'
import { convertNumber2VP, ObjectAssign } from '@tarojs/runtime'

import { AttributeManager } from './AttributeManager'
import { BORDER_STYLE_MAP } from './constant/style'
import { FlexManager } from './flexManager'
import { getUnit, getNodeMarginOrPaddingData, getNodeBorderRadiusData } from './index'

import type { HarmonyStyle } from '../type'


// w3c样式转鸿蒙样式
export function w3cToHarmonyStyle(obj: HarmonyStyle, prop: string, value: string | number) {

  switch (prop) {
    case 'padding':  {
      if (typeof value === 'string') {
        obj.padding = ObjectAssign({}, obj.padding, getNodeMarginOrPaddingData(value))
      }
      break
    }
    case 'paddingTop':  {
      obj.padding = ObjectAssign({}, obj.padding, { top: getUnit(value) })
      break
    }
    case 'paddingLeft':  {
      obj.padding = ObjectAssign({}, obj.padding, { left: getUnit(value) })
      break
    }
    case 'paddingBottom':  {
      obj.padding = ObjectAssign({}, obj.padding, { bottom: getUnit(value) })
      break
    }
    case 'paddingRight':  {
      obj.padding = ObjectAssign({}, obj.padding, { right: getUnit(value) })
      break
    }
    case 'margin':  {
      if (typeof value === 'string') {
        obj.margin = ObjectAssign({}, obj.margin, getNodeMarginOrPaddingData(value))
      }
      break
    }
    case 'marginTop':  {
      obj.margin = ObjectAssign({}, obj.margin, { top: getUnit(value) })
      break
    }
    case 'marginLeft':  {
      obj.margin = ObjectAssign({}, obj.margin, { left: getUnit(value) })
      break
    }
    case 'marginBottom':  {
      obj.margin = ObjectAssign({}, obj.margin, { bottom: getUnit(value) })
      break
    }
    case 'marginRight':  {
      obj.margin = ObjectAssign({}, obj.margin, { right: getUnit(value) })
      break
    }
    case 'flexBasis': {
      obj.flexBasis = getUnit(value)
      break
    }
    case 'flexGrow': {
      obj.flexGrow = Number(value)
      break
    }
    case 'flexShrink': {
      obj.flexShrink = Number(value)
      break
    }
    case 'alignSelf': {
      obj.alignSelf = FlexManager.itemAlign(value)
    }
    case 'flexDirection': {
      if (typeof value === 'string') {
        obj.direction = FlexManager.direction(value)
      }
      break
    }
    case 'justifyContent': {
      obj.justifyContent = FlexManager.flexAlign(value)
      break
    }
    case 'alignItems': {
      obj.alignItems = FlexManager.itemAlign(value)
      break
    }
    case 'width': {
      obj.width = getUnit(value)
      break
    }
    case 'height': {
      obj.height = getUnit(value)
      break
    }
    case 'minHeight': {
      obj.constraintSize = ObjectAssign({}, obj.constraintSize, { minHeight: getUnit(value) })
      break
    }
    case 'minWidth': {
      obj.constraintSize = ObjectAssign({}, obj.constraintSize, { minWidth: getUnit(value) })
      break
    }
    case 'maxHeight': {
      obj.constraintSize = ObjectAssign({}, obj.constraintSize, { maxHeight: getUnit(value) })
      break
    }
    case 'maxWidth': {
      obj.constraintSize = ObjectAssign({}, obj.constraintSize, { maxWidth: getUnit(value) })
      break
    }
    case 'backgroundColor': {
      obj.backgroundColor = value
      break
    }
    case 'backgroundImage': {
      // TODO: 渐变
      if (typeof value === 'string') {
        if (value.indexOf('url(') !== -1 && value.indexOf(')') !== -1) {
          // 如果包含 url()，则说明是 background-image 属性
          const match = value.match(new RegExp('url\\([\'"]?(.*?)[\'"]?\\)'))
          if (match) {
            obj.backgroundImage = match[1]
          }
        }
      }
      break
    }
    case 'backgroundRepeat': {
      if (typeof value === 'string') {
        switch (value) {
          case 'repeat-x': obj.backgroundRepeat = ImageRepeat.X; break;
          case 'repeat-y': obj.backgroundRepeat = ImageRepeat.Y; break;
          case 'no-repeat': obj.backgroundRepeat = ImageRepeat.NoRepeat; break;
          default: obj.backgroundRepeat = ImageRepeat.XY; break;
        }
      }
      break
    }
    case 'backgroundSize': {
      if (typeof value === 'string') {
        const matchs = value.split(new RegExp("/\s+/"))
        const width: Length = matchs[0]
        const height: Length = matchs[1] || width
        obj.backgroundImageSize = {
          width, height
        }
      }
      break
    }
    case 'border': {
      if (typeof value === 'string') {
        const data = getNodeBorderData(value)
        if (data) {
          obj.borderWidth = data.width
          obj.borderColor = data.color
          obj.borderStyle = data.style
        }
      }
      break
    }
    case 'borderWidth': {
      obj.borderWidth = getUnit(value)
      break
    }
    case 'borderColor': {
      obj.borderColor = value
      break
    }
    case 'borderStyle': {
      if (typeof value === 'string') {
        obj.borderStyle = BORDER_STYLE_MAP.get(value)
      }
      break
    }
    case 'borderRadius': {
      if (isNumber(value)) {
        obj.borderRadius = getUnit(value)
      } else {
        obj.borderRadius = getNodeBorderRadiusData(value)
      }
      break
    }
    case 'transform': {
      // TODO
      break
    }
    case 'zIndex': {
      obj.zIndex = Number(value)
      break
    }
    case 'overflow': {
      obj.clip = value === 'hidden'
      break
    }
    case 'focus': {
      obj.focus = Boolean(value)
      break
    }

    // 文本相关
    case 'color': {
      obj.color = value
      break
    }
    case 'fontSize': {
      obj.fontSize = getUnit(value)
      break
    }
    case 'fontWeight': {
      obj.fontWeight = value
      break
    }
    case 'fontFamily': {
      if (typeof value === 'string') {
        obj.fontFamily = value
      }
      break
    }
    case 'textAlign': {
      obj.textAlign = AttributeManager.getTextAlign({ textAlign: value })
      break
    }
    case 'lineHeight': {
      obj.lineHeight = getUnit(value)
      break
    }
    case 'textDecoration': {
      if (typeof value === 'string') {
        switch (value) {
          case 'underline': obj.decoration = TextDecorationType.Underline; break
          case 'overline': obj.decoration = TextDecorationType.Overline; break
          case 'line-through': obj.decoration = TextDecorationType.LineThrough; break
          default: obj.decoration = TextDecorationType.None; break
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
        obj.textOverflow = {
          overflow
        }
      }
      break
    }
    case 'WebkitLineClamp': {
      obj.maxLines = Number(value)
    }
    case 'opacity': {
      obj.opacity = Number(value)
      break
    }
  }

  return obj
}

interface BorderResult {
  width?: Length | EdgeWidths
  color?: ResourceColor | EdgeColors
  radius?: Length | BorderRadiuses
  style?: BorderStyle
}

function getNodeBorderData (border: string): BorderResult | null {
  const borderPattern = new RegExp("/^(\d+(px)?)\s*(\w+)\s*(.+)/")
  const matches = border.match(borderPattern);

  if (!matches) {
    return null;
  }

  const width = matches[1]
  const borderStyle = matches[3]
  const color = matches[4]

  return {
    width: convertNumber2VP(parseFloat(width)),
    style: BORDER_STYLE_MAP.get(borderStyle),
    color: color ? color.trim() : 'black'
  }
}

