import { mergeInternalComponents, mergeReconciler } from '@tarojs/shared'

import { components, hostConfig } from './runtime-utils'

// 支付宝真机只有 navigator.swuserAgent
const { userAgent } = navigator
Object.defineProperty(navigator, 'userAgent', {
  configurable: true,
  enumerable: true,
  get() {
    return userAgent || (navigator as any).swuserAgent || ''
  },
})

mergeReconciler(hostConfig)
const internalComponents = mergeInternalComponents(components)

// 支付宝原生 slider 不支持 block-size / block-color（改用 handle-size / handle-color）。
// 编译期 program.ts 的 modifySlider 已经从模板属性表里删除了这两个属性，
// 运行期这里必须同步删除，否则运行时与编译期的 Slider 属性集不一致，
// 会导致 getComponentsAlias 计算出的属性别名（p0/p1/...）错位，
// 进而导致 min/max/step/value 等属性无法正确传递到原生组件。
const slider = internalComponents.Slider
if (slider) {
  delete slider['block-size']
  delete slider['block-color']
}
