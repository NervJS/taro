import { warn, EMPTY_OBJ } from '@tarojs/shared'
import Taro from '@tarojs/taro'

declare const jd: typeof Taro
declare const qq: typeof Taro
declare const tt: typeof Taro
declare const wx: typeof Taro
declare const swan: typeof Taro
declare const my: typeof Taro

export const env: typeof Taro = (() => {
  if (typeof jd !== 'undefined' && jd.getSystemInfo) {
    return jd
  }
  if (typeof qq !== 'undefined' && qq.getSystemInfo) {
    return qq
  }
  if (typeof tt !== 'undefined' && tt.getSystemInfo) {
    return tt
  }
  if (typeof wx !== 'undefined' && wx.getSystemInfo) {
    return wx
  }
  if (typeof swan !== 'undefined' && swan.getSystemInfo) {
    return swan
  }
  if (typeof my !== 'undefined' && my.getSystemInfo) {
    return my
  }

  warn(process.env.NODE_ENV !== 'test' || !!process.env.PRERENDER, '此环境还没有适配。')
  return EMPTY_OBJ
})()
