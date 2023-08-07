import { convertNumber2PX } from '@tarojs/runtime'
import { capitalize, isString } from '@tarojs/shared'

class AttributeManager {
  static getNodeStyle (style, name: string, defaultValue?) {
    if (!style[name] && style[name] !== 0) return defaultValue // false?

    let value = style[name]

    if (!!value && isString(value) && value.indexOf('url') === -1) {
      value = value.replace('px', '')
    }

    return value
  }

  static  getNodeTextDecoration (style): { type: TextDecorationType; color?: ResourceColor } {
    const value = AttributeManager.getNodeStyle(style, 'textDecoration', 'none')
    const type = value.split('-').map(item => capitalize(item)).join('')

    return {
      type: TextDecorationType[type] as any,
      color: AttributeManager.getNodeStyle(style, 'color', 'black')
    }
  }

  static getNodeHeight (style) {
    // TODO: 没有办法判断实际高度是否大于 minHeight
    return AttributeManager.getNodeStyle(style, 'minHeight') || AttributeManager.getNodeStyle(style, 'height')
  }

  static getNodeLinearGradient (style) {
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
      const stops = match[2].match(/rgba?\(.+?\)\s*\d*%|#\w+\s*\d*%/gi)

      for (let stop of stops) {
        const match = stop.match(/(rgba?\(.+?\)|#\w+)\s*(\d*%?)?/i)
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

  static getNodeBackGroundData (style, name: string) {
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

      if (part.charAt(0) === '#' ||  part.indexOf('rgb(') !== -1 || part.indexOf('hsl(') !== -1) {
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

  static getNodeMarginOrPaddingData (style, name: 'margin' | 'padding') {
    let res: any = {}
    const dataValue = AttributeManager.getNodeStyle(style, name)

    if (dataValue) {
      const values = dataValue.split(/\s+/)
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
        if (!isNaN(res[key]) && values.length > 1) {
          res[key] = convertNumber2PX(res[key])
        }
      })
    }

    return {
      top: AttributeManager.getNodeStyle(style, `${name}Top`) || res.top || 0,
      bottom: AttributeManager.getNodeStyle(style, `${name}Bottom`) || res.bottom || 0,
      left: AttributeManager.getNodeStyle(style, `${name}Left`) || res.left || 0,
      right: AttributeManager.getNodeStyle(style, `${name}Right`) || res.right || 0,
    }
  }
}

export { AttributeManager }
