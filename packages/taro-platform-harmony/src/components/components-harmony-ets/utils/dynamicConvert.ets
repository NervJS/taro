import { convertNumber2VP } from "@tarojs/runtime"
import { capitalize, isNumber } from "@tarojs/shared"

import { BORDER_STYLE_MAP } from './constant/style'
import { FlexManager } from "./flexManager"
import { AttributeManager } from './AttributeManager'

// w3c样式转鸿蒙样式
export function w3cToHarmonyStyle(obj: Record<string, any>, prop: string, value: any) {

  switch (prop) {
    case 'padding':  {
      obj['padding'] = Object.assign({}, obj['padding'], getNodeMarginOrPaddingData(value))
      break
    }
    case 'paddingTop':  {
      obj['padding'] = Object.assign({}, obj['padding'], { top: getUnit(value) })
      break
    }
    case 'paddingLeft':  {
      obj['padding'] = Object.assign({}, obj['padding'], { left: getUnit(value) })
      break
    }
    case 'paddingBottom':  {
      obj['padding'] = Object.assign({}, obj['padding'], { bottom: getUnit(value) })
      break
    }
    case 'paddingRight':  {
      obj['padding'] = Object.assign({}, obj['padding'], { right: getUnit(value) })
      break
    }
    case 'margin':  {
      obj['margin'] = Object.assign({}, obj['margin'], getNodeMarginOrPaddingData(value))
      break
    }
    case 'marginTop':  {
      obj['margin'] = Object.assign({}, obj['margin'], { top: getUnit(value) })
      break
    }
    case 'marginLeft':  {
      obj['margin'] = Object.assign({}, obj['margin'], { left: getUnit(value) })
      break
    }
    case 'marginBottom':  {
      obj['margin'] = Object.assign({}, obj['margin'], { bottom: getUnit(value) })
      break
    }
    case 'marginRight':  {
      obj['margin'] = Object.assign({}, obj['margin'], { right: getUnit(value) })
      break
    }
    case 'flexBasis': {
      obj['flexBasis'] = getUnit(value)
      break
    }
    case 'flexGrow': {
      obj['flexGrow'] = +value
      break
    }
    case 'flexShrink': {
      obj['flexShrink'] = +value
      break
    }
    case 'alignSelf': {
      obj['alignSelf'] = FlexManager.itemAlign(value)
    }
    case 'flexDirection': {
      obj['direction'] = FlexManager.flexDirection({ flexDirection: value })
      break
    }
    case 'justifyContent': {
      obj['justifyContent'] = FlexManager.flexAlign(value)
      break
    }
    case 'alignItems': {
      obj['alignItems'] = FlexManager.itemAlign(value)
      break
    }
    case 'width': {
      obj['width'] = getUnit(value)
      break
    }
    case 'height': {
      obj['height'] = getUnit(value)
      break
    }
    case 'minHeight': {
      obj['constraintSize'] = Object.assign({}, obj['constraintSize'], { minHeight: getUnit(value) })
      break
    }
    case 'minWidth': {
      obj['constraintSize'] = Object.assign({}, obj['constraintSize'], { minWidth: getUnit(value) })
      break
    }
    case 'maxHeight': {
      obj['constraintSize'] = Object.assign({}, obj['constraintSize'], { maxHeight: getUnit(value) })
      break
    }
    case 'maxWidth': {
      obj['constraintSize'] = Object.assign({}, obj['constraintSize'], { maxWidth: getUnit(value) })
      break
    }
    case 'backgroundColor': {
      obj['backgroundColor'] = value
      break
    }
    case 'backgroundImage': {
      // TODO: 渐变
      if (value.indexOf('url(') !== -1 && value.indexOf(')') !== -1) {
        // 如果包含 url()，则说明是 background-image 属性
        var match = value.match(/url\(['"]?(.*?)['"]?\)/)
        if (match) {
          obj['backgroundImage'] = match[1]
        }
      }
      break
    }
    case 'backgroundRepeat': {
      const [x, y = x] = value.split(/\s+/)
      obj['backgroundRepeat'] = {
        x, y
      }
      break
    }
    case 'backgroundSize': {
      const [width, height = width] = value.split(/\s+/)
      obj['backgroundImageSize'] = {
        width, height
      }
      break
    }
    case 'border': {
      const data = getNodeBorderData(value)
      if (data) {
        obj['borderWidth'] = data.width
        obj['borderColor'] = data.color
        obj['borderStyle'] = data.style
      }
      break
    }
    case 'borderWidth': {
      obj['borderWidth'] = getUnit(value)
      break
    }
    case 'borderColor': {
      obj['borderColor'] = value
      break
    }
    case 'borderStyle': {
      obj['borderStyle'] = BORDER_STYLE_MAP[value]
      break
    }
    case 'borderRadius': {
      obj['borderRadius'] = getUnit(value)
      break
    }
    case 'transform': {
      // TODO
      break
    }
    case 'zIndex': {
      obj['zIndex'] = +value || null
      break
    }
    case 'overflow': {
      obj['clip'] = value === 'hidden'
      break
    }
    case 'focus': {
      obj['focus'] = value
      break
    }

    // 文本相关
    case 'color': {
      obj['fontColor'] = value
      break
    }
    case 'fontSize': {
      obj['fontSize'] = getUnit(value)
      break
    }
    case 'fontWeight': {
      obj['fontWeight'] = value
      break
    }
    case 'fontFamily': {
      obj['fontFamily'] = value
      break
    }
    case 'textAlign': {
      obj['textAlign'] = AttributeManager.getTextAlign({ textAlign: value })
      break
    }
    case 'lineHeight': {
      obj['lineHeight'] = getUnit(value)
      break
    }
    case 'textDecoration': {
      obj['decoration'] = value
      break
    }
    case 'textOverflow': {
      // @ts-ignore
      obj['textOverflow'] = { overflow: TextOverflow[capitalize(value || 'none')] }
      break
    }
    case 'WebkitLineClamp': {
      obj['maxLines'] = +value
    }
    case 'opacity': {
      obj['opacity'] = +value
      break
    }
  }

  return obj
}

function getUnit (val) {
  if (/\d+(vp)$/.test(val)) {
    return val
  } else if (isNumber(val) || /\d+px$/.test(val)) {
    return convertNumber2VP(parseFloat(val))
  }
  return val
}

function getNodeMarginOrPaddingData (dataValue: string) {
  let res: any = {}
  if (dataValue) {
    const values = dataValue.trim().split(/\s+/)
    switch (values.length) {
      case 1:
        res = { top: values[0], right: values[0], bottom: values[0], left: values[0] }
        break
      case 2:
        res = { top: values[0], right: values[1], bottom: values[0], left: values[1] }
        break
      case 3:
        res = { top: values[0], right: values[1], bottom: values[2], left: values[1] }
        break
      case 4:
        res = { top: values[0], right: values[1], bottom: values[2], left: values[3] }
        break
      default:
        break
    }
    Object.keys(res).forEach(key => {
      let exec = `${res[key]}`.match(/(\d+)(px)$/)
      if (exec && values.length > 1) {
        res[key] = getUnit(+exec[1])
      }
    })
  }
  return res
}


function getNodeBorderData (border: string) {
  if (!border) return null
  const borderPattern = /^(\d+(px)?)\s*(\w+)\s*(.+)/;
  const matches = border.match(borderPattern);

  if (!matches) {
    return null;
  }

  const [, width, , borderStyle, color] = matches;

  return {
    width: convertNumber2VP(parseFloat(width)),
    style: BORDER_STYLE_MAP[borderStyle],
    color: color ? color.trim() : 'black'
  }
}
