import { warn } from '@tarojs/shared'
import { initNativeApi } from './apis'

export { initNativeApi }
export * from './components'
export * from './apis-list'
export const hostConfig = {
  initNativeApi,
  onTaroElementCreate (tagName: string) {
    warn(
      tagName === 'MAP',
      '微信小程序 map 组件的 `setting` 属性需要传递一个默认值。详情：\n https://developers.weixin.qq.com/miniprogram/dev/component/map.html'
    )
  }
}
