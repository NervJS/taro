export const PROPERTY_THRESHOLD = 2046
export const TARO_RUNTIME = 'Taro runtime'
export const SET_DATA = '小程序 setData'
export const PAGE_INIT = '页面初始化'
export const SPECIAL_NODES = process.env.TARO_ENV === 'swan'
  ? ['text', 'image']
  : ['view', 'text', 'image']
