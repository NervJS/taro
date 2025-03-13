import { TaroNativeModule as nativeNode } from '../harmony-library'
import { FatalTaroError, TaroError } from './Error'
import { TaroLogger } from './Logger'
import { TurboModuleProvider } from './turbo-module/TurboModuleProvider'

import type { TaroAny } from '@tarojs/runtime'

export interface ArkTSBridgeHandler {
  getDisplayMetrics: () => void
  // getDisplayMetrics: () => DisplayMetrics
  handleError: (taroError: TaroError) => void
}

interface INapiBridgeInit {
  isDebugModeEnabled: boolean
}

interface IArkTSBridgeError {
  message: string
  stacktrace?: string[]
  suggestions?: string[]
}

export class NapiBridge {
  private logger: TaroLogger
  private libTaroApp: TaroAny

  constructor(logger: TaroLogger) {
    this.libTaroApp = nativeNode
    this.logger = logger.clone('NapiBridge')
  }

  onInit(shouldCleanUpTaroInstances: boolean): INapiBridgeInit {
    if (!this.libTaroApp) {
      const err = new FatalTaroError({
        whatHappened: "Couldn't create bindings between ETS and CPP. libTaroApp is undefined.",
        howCanItBeFixed: []
      })
      this.logger.fatal(err)
      throw err
    }

    return this.libTaroApp?.onInit(shouldCleanUpTaroInstances)
  }

  loadScript(instanceId: number, bundle: ArrayBuffer | string, cache: ArrayBuffer, sourceURL: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.libTaroApp?.startEngineTest()
      this.libTaroApp?.loadScript(instanceId, bundle, cache, sourceURL, (errorMsg: string) => {
        errorMsg ? reject(new Error(errorMsg)) : resolve()
      })
    })
  }

  loadScriptSync(instanceId: number, bundle: ArrayBuffer | string, cache: ArrayBuffer, sourceURL: string): Promise<void> {
    return this.libTaroApp?.loadScriptSync(instanceId, bundle, cache, sourceURL)
    return new Promise((resolve, reject) => {
      this.libTaroApp?.startEngineTest()
      this.libTaroApp?.loadScript(instanceId, bundle, cache, sourceURL, (errorMsg: string) => {
        errorMsg ? reject(new Error(errorMsg)) : resolve()
      })
    })
  }

  initializeArkTSBridge(handler: ArkTSBridgeHandler) {
    this.libTaroApp?.initializeArkTSBridge({
      getDisplayMetrics: () => handler.getDisplayMetrics(),
      handleError: (errData: IArkTSBridgeError) => {
        handler.handleError(new TaroError({
          whatHappened: errData.message,
          howCanItBeFixed: (errData.suggestions ?? []),
          customStack: (errData.stacktrace ?? []).join('\n'),
        }))
      }
    })
  }

  getNextTaroInstanceId(): number {
    return this.libTaroApp?.getNextTaroInstanceId()
  }

  createTaroInstance(
    instanceId: number,
    shouldEnableBackgroundExecutor: boolean,
    turboModuleProvider: TurboModuleProvider,
  ) {
    this.libTaroApp?.createTaroInstance(instanceId, shouldEnableBackgroundExecutor, turboModuleProvider)
  }

  destroyTaroInstance(instanceId: number) {
    this.libTaroApp?.destroyTaroInstance(instanceId)
  }
}
