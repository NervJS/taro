import Taro from '@tarojs/taro'

// In DEV mode, this Set helps us only log a warning once per component instance.
// This avoids spamming the console every time a render happens.
export const defaultItemKey = (index: number) => index

export function isHorizontalFunc ({ direction, layout }: any) {
  return direction === 'horizontal' || layout === 'horizontal'
}

export function isRtlFunc ({ direction }: any) {
  return direction === 'rtl'
}

export function getRectSize (id, success: any = () => {}, fail = () => {}) {
  const query = Taro.createSelectorQuery()
  try {
    query.select(id).boundingClientRect((res) => {
      if (res) {
        success(res)
      } else {
        fail()
      }
    }).exec()
  } catch (err) {
    // fail()
  }
}
