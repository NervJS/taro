import { TaroNativeModule } from './harmony-library'

import type { BusinessError } from '@kit.BasicServicesKit'
import type { TaroAny, TaroObject } from '@tarojs/runtime'

export const context: TaroAny = {
  resolver: null,
  value: null
}

export const uiContext: TaroAny = {
  resolver: null,
  value: null
}

export const Current: TaroAny = {
  isDebug: false,
  get context () {
    return context.value
  },
  set context (e: TaroAny) {
    context.resolver(e)
  },
  get uiContext () {
    return uiContext.value
  },
  set uiContext (e: TaroAny) {
    uiContext.resolver(e)
  },
  router: {} as TaroObject,
  taro: {} as TaroObject,
  contextPromise: new Promise<TaroAny>(resolve => {
    context.resolver = resolve

    return resolve
  }).then((e: TaroAny): TaroAny => {
    context.value = e
    // 监听配置更新
    try {
      const callbackId: number = e.getApplicationContext()
        .on('environment', {
          onConfigurationUpdated(config: TaroAny) {
            AppStorage.setOrCreate('__TARO_APP_CONFIG', config)
          },
          onMemoryLevel(level: number /** AbilityConstant.MemoryLevel */) {
            console.log(`TARO_LOG: onMemoryLevel level: ${level}`)
          }
        })
      console.log(`TARO_LOG: registerEnvironmentCallback callbackId: ${callbackId}`)
    } catch (e) {
      console.error(`TARO_LOG: environment error ${(e as BusinessError).code}, ${(e as BusinessError).message}`)
    }

    return e
  }),
  uiContextPromise: new Promise<TaroAny>(resolve => {
    uiContext.resolver = resolve

    return resolve
  }).then((e: TaroAny): TaroAny => {
    uiContext.value = e

    return e
  }),
  nativeModule: TaroNativeModule,
}

export const getCurrentInstance = (): TaroAny => Current
