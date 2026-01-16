/**
 * 匹配到缩写的颜色值时进行扩写，如 '#fff'扩写后为'#ffffff'
 * @param hex
 */
function expandHex (hex) {
  return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (_m, r, g, b) {
    return '#' + r + r + g + g + b + b
  })
}

/**
 * 颜色反转，用于适配深色模式
 * @param hex 十六进制颜色值
 */
export function invertColor (hex: string) {
  // 扩展缩写的颜色值
  hex = expandHex(hex)

  // 移除 # 符号
  hex = hex.replace('#', '')

  // 将十六进制转换为RGB
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  // 反转RGB值
  r = 255 - r
  g = 255 - g
  b = 255 - b

  // 将RGB值转换回十六进制
  return '#' + (r.toString(16).padStart(2, '0')) + (g.toString(16).padStart(2, '0')) + (b.toString(16).padStart(2, '0'))
}
