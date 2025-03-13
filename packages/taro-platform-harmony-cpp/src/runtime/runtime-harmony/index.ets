import _display from '@ohos.display'
import BuildProfile from 'BuildProfile'

import { handleTaroApis } from './apis'
import { Current, getCurrentInstance } from './current'
import { eventCenter } from './emitter/emitter'

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
// FIXME
eventCenter?.on('__taroPluginEtsMethodsTrigger', (option: IEtsMethodsOptions) => {
  switch (option.scope) {
    case 'apis':
      handleTaroApis(option)
      break
      break
    default:
      console.error(`Error(TaroETS): cannot found ${option.type} ${option.name} in ${option.scope} scope.`)
  }
})

if (BuildProfile.DEBUG) {
  console.log('TARO_LOG(harmony_cpp): 当前是测试环境！')
  Current.isDebug = true
}

export * from './jsvm/JSBundleProvider'
export * from './jsvm/Logger'
export * from './jsvm/TaroApp'
export * from './jsvm/TaroContext'
export * from './jsvm/TaroInstance'

export * from './harmony-library'
export * from './stylesheet'

export { Current, getCurrentInstance, eventCenter }
export * from './page'
export * from './utils'
