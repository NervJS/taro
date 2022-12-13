import Taro from '@tarojs/taro'

// In DEV mode, this Set helps us only log a warning once per component instance.
// This avoids spamming the console every time a render happens.
export const defaultItemKey = (index: number, _itemData?: unknown) => index

interface IHorizontal {
  direction?: string
  layout?: string
}
export function isHorizontalFunc ({ direction, layout }: IHorizontal) {
  return direction === 'horizontal' || layout === 'horizontal'
}
interface IRrl {
  direction?: string
}
export function isRtlFunc ({ direction }: IRrl) {
  return direction === 'rtl'
}

export function getRectSize (id: string, success: TFunc = () => {}, fail: TFunc = () => {}) {
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
    setTimeout(() => {
      getRectSize(id, success, fail)
    }, 400)
  }
}
