import Taro from '@tarojs/taro'

/**
 * 供 picker 系列组件专用，未涉及 designAppVersion 17 的修改所以不做判断
 */

// 大屏方案版本要求
const MIN_DESIGN_APP_VERSION = 16

// 判断是否启用测量值缩放适配（true=启用, false=使用系统侧缩放）
export const resolveUseMeasuredScale = (res: Taro.getSystemInfo.Result): boolean => {
  // H5/weapp 不参与大屏系数
  if (process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'weapp') {
    return false
  }

  const designAppVersionRaw = (res as any).designAppVersion
  const designAppVersionMajor = designAppVersionRaw != null ? parseInt(String(designAppVersionRaw).trim(), 10) : Number.NaN
  if (!Number.isFinite(designAppVersionMajor) || designAppVersionMajor < MIN_DESIGN_APP_VERSION) {
    return false
  }

  const platform = String((res as any).platform || '').toLowerCase()
  if (platform === 'harmony' || platform === 'android' || platform === 'ios') {
    return true
  }

  return false
}
