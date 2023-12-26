import Taro from '@tarojs/api'

/**
 * 获取菜单按钮（右上角胶囊按钮）的布局位置信息
 * 
 * @canUse getMenuButtonBoundingClientRect
 * @__return [left, top, right, bottom, height, width]
 */
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
