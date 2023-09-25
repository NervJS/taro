import { Dimensions, Platform } from 'react-native'

// 一般app 只有竖屏模式，所以可以只获取一次 width
const deviceWidthDp = Dimensions.get('window').width
const deviceHeightDp = Dimensions.get('window').height
let uiWidthPx = 375

if (Platform.OS === 'ios') {
  if (Platform.isPad) {
    uiWidthPx = 750
  }
}

export function scalePx2dp (uiElementPx) {
  return uiElementPx * deviceWidthDp / uiWidthPx
}
export function scaleVu2dp (uiElementPx, unit) {
  if (unit === 'vh') return uiElementPx * deviceHeightDp / 100
  if (unit === 'vmax') return uiElementPx * Math.max(deviceWidthDp, deviceHeightDp) / 100
  if (unit === 'vmin') return uiElementPx * Math.min(deviceWidthDp, deviceHeightDp) / 100
  return uiElementPx * deviceWidthDp / 100
}
