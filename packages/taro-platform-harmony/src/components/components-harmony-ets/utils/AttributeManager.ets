import { convertNumber2VP } from '@tarojs/runtime'
import matrix4 from '@ohos.matrix4'
import { BORDER_STYLE_MAP } from './constant/style'
import { capitalize, isString } from '@tarojs/shared'

class AttributeManager {
  static getStyleAfterConvert (style = {}, name: string, defaultValue?) {
    name = '_' + name

    if (!style[name] && style[name] !== 0) return defaultValue

    return style[name]
  }

  static getNodeStyle (style = {}, name: string, defaultValue?) {
    const res = style[name]

    if (res === undefined) return defaultValue

    return res
  }

  static getNodeLinearGradient (style = {}) {
    const str = style.backgroundImage || style.background

    if (!str || !str.includes("linear-gradient")) return

    let gradient = null
    const match = str.match(/linear-gradient\((\d+)deg\s*,\s*(.+)\)/i)

    if (match) {
      gradient = {
        angle: parseInt(match[1]),
        colors: []
      }

      const colors = [];
      const percentages = [];
      const stops = match[2].match(/rgba?\(.+?\)\s*\d*%|#?\w+\s*\d*%/gi)

      for (let stop of stops) {
        const match = stop.match(/(rgba?\(.+?\)|#?\w+)\s*(\d*%?)?/i)
        if (match) {
          const color = match[1].trim()
          colors.push(color)
          const percentage = match[2] || '0%'
          percentages.push(percentage)
        }
      }

      const colorStops = colors.map((color, index) => `${color} ${percentages[index]}`)

      for (let stop of colorStops) {
        const colorMatch = stop.split(' ')
        if (colorMatch) {
          const color = colorMatch[0].trim();
          const progress = parseFloat(colorMatch[1]) / 100

          gradient.colors.push([color, progress])
        }
      }
    }

    return gradient
  }

  static getTextAlign (style = {}) {
    const value = style.textAlign
    switch (value) {
      case 'right':
        return TextAlign.End
      case 'center':
        return TextAlign.Center
      default:
        return TextAlign.Start
    }
  }

  static getNodeBackGroundData (style = {}, name: string) {
    const background = style.background
    const singleItem = AttributeManager.getNodeStyle(style, name)

    if (singleItem) return singleItem
    if (!background) return

    var result = {}
    // TODO: 这里也有问题，background: 'rgb(255, 255, 255)'，这种样式会被分割
    var parts = background.split(' ')
    let hasSlash = false

    const addBackgroundData = (part: string) => {
      const name = hasSlash ? 'backgroundPosition' : 'backgroundSize'

      if (result[name]) {
        result[name] += ' ' + part
      } else {
        result[name] = part
      }
    }

    // 遍历所有属性进行解析
    parts.forEach((part: string) => {
      const isBackGroundImageSize = part === 'contain' || part === 'cover' || part === 'auto'
      const isBackGroundPosition = part === 'left' || part === 'center' || part === 'right' ||
        part === 'top' || part === 'bottom'
      const partHasSlash = part.indexOf('/') !== -1 && part.indexOf('url') === -1
      // todo：这里会将linear-gradient的空格也处理了
      if (part.charAt(0) === '#' || part.indexOf('rgb(') !== -1 || part.indexOf('hsl(') !== -1) {
        // 如果以 # 开头或包含 rgb/hsl，则说明是 background-color 属性
        result['backgroundColor'] = part
        return
      } else if (part.indexOf('url(') !== -1 && part.indexOf(')') !== -1) {
        // 如果包含 url()，则说明是 background-image 属性
        var match = part.match(/url\(['"]?(.*?)['"]?\)/)

        if (match) {
          result['backgroundImage'] = match[1]
        }
        return
      }

      if (isBackGroundImageSize) {
        addBackgroundData(ImageSize[capitalize(part)])
        return
      }
      if (isBackGroundPosition) {
        addBackgroundData(Alignment[capitalize(part)])
        return
      }

      // 出现分割线之后，标记一下，因为分割线前是 backgroundPosition，分割线后是 backgroundSize
      if (partHasSlash) {
        const [backgroundPositionPart, backgroundSizePart] = part.split['/']

        addBackgroundData(Alignment[capitalize(backgroundPositionPart)])
        hasSlash = true
        addBackgroundData(ImageSize[capitalize(backgroundSizePart)])

        return
      }
      // TODO: background-size 和 background-position 的解析还未完善，因为 ArkTS 不支持诸如 auto 30% 这样的格式
    })

    return result[name]
  }

  static getBorderRadiusData (style = {}) {
    let res: any = {}
    const dataValue = AttributeManager.getNodeStyle(style, 'borderRadius')

    if (dataValue) {
      res = dataValue
    }

    return res
  }

  static getNodeAnimationData (style = {}) {
    let res: any = {}
    const dataValue = AttributeManager.getNodeStyle(style, 'animation')

    if (dataValue) {
      let values = dataValue.trim().split(/,/)[0]
      values = dataValue.trim().split(/\s+/)
      switch (values.length) {
        case 4:
          res = { duration: values[0], curve: values[1], delay: values[2] }
          break
        case 8:
          res = { duration: values[0], curve: values[1], delay: values[2], iterations: values[3], playMode: values[4] }
          break
        default:
          break
      }

      Object.keys(res).forEach(key => {
        if (!isNaN(res[key]) && values.length > 1) {
          res[key] = convertNumber2VP(res[key])
        }
      })
    }

    let playMode = AttributeManager.getNodeStyle(style, 'animationDirection') || res.playMode
    switch (playMode) {
      case 'reverse':
        playMode = PlayMode.Reverse
        break
      case 'alternate':
        playMode = PlayMode.Alternate
        break
      case 'alternate-reverse':
        playMode = PlayMode.AlternateReverse
        break
      case 'normal':
      default:
        playMode = PlayMode.Normal
    }
    return {
      duration: this.parseTime2Number(AttributeManager.getNodeStyle(style, 'animationDuration') || res.duration || 1000),
      tempo: 1,
      curve: AttributeManager.getNodeStyle(style, 'animationTimingFunction') || res.curve || Curve.EaseInOut,
      delay: this.parseTime2Number(AttributeManager.getNodeStyle(style, 'animationDelay') || res.delay || 0),
      iterations: Number(AttributeManager.getNodeStyle(style, 'animationIterationCount') || res.iterations) || 1,
      playMode,
      // TODO onFinish
    }
  }

  static getNodeBorderData (style = {}) {
    const border = style.border || ''
    const borderPattern = /^(\d+(px)?)\s*(\w+)\s*(.+)/;
    const matches = border.match(borderPattern);

    if (!matches) {
      return null;
    }

    const [, width, , borderStyle, color] = matches;

    return {
      width,
      style: BORDER_STYLE_MAP[borderStyle],
      radius: AttributeManager.getBorderRadiusData(style),
      color: color ? color.trim() : (style.color || 'black')
    }
  }

  static parseTime2Number (time = '') {
    if (typeof time === 'number') return time
    if (time === 'infinite') return Infinity
    if (time === 'auto') return 0

    let [, value, unit] = time.match(/^(\d*)([a-z]*)$/) || []
    let ms = Number(value)
    switch (unit) {
      case 's':
        ms *= 1000
        break
      case 'ms':
      default:
        ms *= 1
    }
    return ms
  }

  static getTransform(style = {}) {
    const transform = style.transform || ''
    const transformOrigin = AttributeManager.getNodeStyle(style, 'transformOrigin') || '0 0'

    const origin = transformOrigin.split(/\s+/).map(item => item)

    const result = {}

    const matches = transform.match(/(\w+)\(([^)]+)\)/g) || [];

    // 处理matrix

    matches.forEach(match => {
      const [name, ...params] = match.split(/\(|\)/).filter(Boolean);

      switch (name) {
        case 'translateX':
          result.translateX = parseTransformUnit(params[0])
          break;
        case 'translateY':
          result.translateY = parseTransformUnit(params[0])
          break;
        case 'translateZ':
          result.translateZ = parseTransformUnit(params[0])
          break;
        case 'scaleX':
          result.scaleX = parseTransformUnit(params[0])
          break;
        case 'scaleY':
          result.scaleY = parseTransformUnit(params[0])
          break;
        case 'scaleZ':
          result.scaleZ = parseTransformUnit(params[0])
          break;
        case 'rotateX':
          result.rotateX = parseTransformUnit(params[0])
          break;
        case 'rotateY':
          result.rotateY = parseTransformUnit(params[0])
          break;
        case 'rotateZ':
          result.rotateZ = parseTransformUnit(params[0])
          break;
        case 'skewX':
          result.skewX = parseTransformUnit(params[0])
          break;
        case 'skewY':
          result.skewY = parseTransformUnit(params[0])
          break;
        case 'translate':
          const xy = params[0].split(/\s*,\s*/)
          result.translateX = parseTransformUnit(xy[0])
          result.translateY = parseTransformUnit(xy[1])
          break;
        case 'translate3d':
          const xyz = params[0].split(/\s*,\s*/)
          result.translateX = parseTransformUnit(xyz[0])
          result.translateY = parseTransformUnit(xyz[1])
          result.translateZ = parseTransformUnit(xyz[2])
          break;
        case 'scale':
          result.scaleX = parseTransformUnit(params[0])
          result.scaleY = parseTransformUnit(params[1]) || result.scaleX
          break;
        case 'scale3d':
          result.scaleX = parseTransformUnit(params[0])
          result.scaleY = parseTransformUnit(params[1]) || result.scaleX
          result.scaleZ = parseTransformUnit(params[2]) || result.scaleX
          break;
        case 'rotate':
          const angle = parseTransformUnit(params[0])
          const axis = parseTransformUnit(params[1]) || 'z';
          result[`rotate${axis.toUpperCase()}`] = angle;
          break;
        case 'rotate3d':
          const rotate3DAngle = parseTransformUnit(params[3]) || 0
          result.rotateX = parseTransformUnit(params[0]) ? rotate3DAngle : 0
          result.rotateY = parseTransformUnit(params[1]) ? rotate3DAngle : 0
          result.rotateZ  = parseTransformUnit(params[2]) ? rotate3DAngle : 0
          break;
        case 'skew':
          result.skewX = parseTransformUnit(params[0])
          result.skewY = parseTransformUnit(params[1]);
          break;
        case 'matrix':
          const matrixArr = params[0].split(',').map(item => parseFloat(item))
          result.transform = matrix4.init(convertMatrixToMatrix3d(matrixArr))
          break;
        case 'matrix3d':
          const matrix3dArr = params[0].split(',').map(item => parseFloat(item))
          result.transform = matrix4.init(matrix3dArr)
          break;
      }
    })

    return {
      rotate: {
        x: parseFloat(result.rotateX) ? 1 : 0,
        y: parseFloat(result.rotateY) ? 1 : 0,
        z: parseFloat(result.rotateZ) ? 1 : 0,
        angle: parseFloat(result.rotateX || result.rotateY || result.rotateZ) || 0,
        centerX: origin[0],
        centerY: origin[1]
      },
      translate: {
         x: result.translateX || 0,
         y: result.translateY || 0,
         z: result.translateZ || 0
      },
      scale: {
        x: parseFloat(result.scaleX),
        y: parseFloat(result.scaleY),
        z: parseFloat(result.scaleZ),
        centerX: origin[0],
        centerY: origin[1]
      },
      transform: result.transform
    };
  }
}


function parseTransformUnit (val: string) {
  return parseFloat(val) === 0 ? 0 : val
}

// matrix 转 matrix3d
function convertMatrixToMatrix3d(matrix2d: number[]) {
  const matrix3d = new Array(16).fill(0);
  matrix3d[0] = matrix2d[0];
  matrix3d[5] = matrix2d[3];
  matrix3d[10] = 1;
  matrix3d[15] = 1;
  matrix3d[12] = matrix2d[4];
  matrix3d[13] = matrix2d[5];
  return matrix3d;
}

export { AttributeManager }
