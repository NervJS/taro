import common from '@ohos.app.ability.common'

import { TaroLogger } from './Logger'
import { TaroInstance, TaroInstanceImpl, TaroInstanceOptions } from './TaroInstance'
import { TaroInstanceRegistry } from './TaroInstanceRegistry'

export class TaroCoreContext {
  public static create(
    logger: TaroLogger,
    uiAbilityContext: common.UIAbilityContext,
    taroInstanceRegistry: TaroInstanceRegistry
  ) {
    return new TaroCoreContext(
      (options) => {
        const stopTracing = logger.clone('createAndRegisterTaroInstance').startTracing()
        const result = taroInstanceRegistry.createInstance(options)
        stopTracing()
        return result
      },
      (taroInstance) => {
        const stopTracing = logger.clone('destroyAndUnregisterTaroInstance').startTracing()
        if (taroInstance instanceof TaroInstanceImpl) {
          taroInstance.onDestroy()
        }
        taroInstanceRegistry.deleteInstance(taroInstance.getId())
        stopTracing()
      },
      logger,
      uiAbilityContext
    )
  }

  private __instance: TaroInstance | null = null

  public createAndRegisterTaroInstance: (options: TaroInstanceOptions) => TaroInstance;
  public destroyAndUnregisterTaroInstance: (taroInstance: TaroInstance) => void;
  public logger: TaroLogger;
  public uiAbilityContext: common.UIAbilityContext;

  protected constructor(
    createAndRegisterTaroInstance: (options: TaroInstanceOptions) => TaroInstance,
    destroyAndUnregisterTaroInstance: (taroInstance: TaroInstance) => void,
    logger: TaroLogger,
    uiAbilityContext: common.UIAbilityContext,
  ) {
    this.createAndRegisterTaroInstance = createAndRegisterTaroInstance;
    this.destroyAndUnregisterTaroInstance = destroyAndUnregisterTaroInstance;
    this.logger = logger;
    this.uiAbilityContext = uiAbilityContext;
  }

  getInstance (option: TaroInstanceOptions = {
    enableBackgroundExecutor: false,
  }) {
    if (!this.__instance) {
      this.__instance = this.createAndRegisterTaroInstance(option)
    }

    return this.__instance
  }

  async destroyInstance () {
    if (this.__instance) {
      this.destroyAndUnregisterTaroInstance(this.__instance)
      this.__instance = null
    }
  }
}

export class TaroContext extends TaroCoreContext {
  static fromCoreContext(coreContext: TaroCoreContext, taroInstance: TaroInstance) {
    if (!(taroInstance instanceof TaroInstanceImpl)) {
      throw new Error('TaroInstance must extend TaroInstanceImpl')
    }
    return new TaroContext(taroInstance, coreContext)
  }

  private taroInstanceImpl: TaroInstanceImpl

  protected constructor(
    taroInstanceImpl: TaroInstanceImpl,
    coreContext: TaroCoreContext
  ) {
    super(
      coreContext.createAndRegisterTaroInstance,
      coreContext.destroyAndUnregisterTaroInstance,
      coreContext.logger,
      coreContext.uiAbilityContext,
    )
    this.taroInstanceImpl = taroInstanceImpl
  }
}
