import Taro from '@tarojs/api'

// 菜单
export const getMenuButtonBoundingClientRect: typeof Taro.getMenuButtonBoundingClientRect = () => {
  // @ts-ignore
  const data = native.getMenuButtonBoundingClientRect()
  const rect = JSON.parse(JSON.stringify(data))
  return {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    height: rect.height,
    width: rect.width,
  }
}
