import { Current, eventCenter } from '@tarojs/runtime'
import BuildProfile from 'BuildProfile'

import type { TaroAny } from '@tarojs/runtime'

export interface IEtsMethodsOptions {
  methodName?: string
  name?: string
  scope?: string
  type?: string
  args?: TaroAny[]
  successHandler?: (...args: TaroAny[]) => void
  errorHandler?: (...args: TaroAny[]) => void
  onInit?: (obj: TaroAny) => void
}

// Note: 监听 API 事件
eventCenter?.on('__taroPluginEtsMethodsTrigger', (option: IEtsMethodsOptions) => {
  switch (option.scope) {
    default:
      console.error(`Error(TaroETS): cannot found ${option.type} ${option.name} in ${option.scope} scope.`)
  }
})

if (BuildProfile.DEBUG) {
  console.log('TARO_LOG(harmony_cpp): 当前是测试环境！')
  Current.isDebug = true
}
