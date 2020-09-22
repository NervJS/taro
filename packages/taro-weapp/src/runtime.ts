import { warn, mergeReconciler, mergeInternalComponents } from '@tarojs/shared'
import { initNativeApi } from './apis'
import { components } from './components'

const hostConfig = {
  initNativeApi,
  onTaroElementCreate (tagName: string) {
    warn(
      tagName === 'MAP',
      '微信小程序 map 组件的 `setting` 属性需要传递一个默认值。详情：\n https://developers.weixin.qq.com/miniprogram/dev/component/map.html'
    )
  }
}

mergeReconciler(hostConfig)
mergeInternalComponents(components)
