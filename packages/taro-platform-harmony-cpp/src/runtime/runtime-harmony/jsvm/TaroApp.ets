import { common } from '@kit.AbilityKit'

import { TaroLogger } from './Logger'
import { NapiBridge } from './NapiBridge'
import { TaroContext, TaroCoreContext } from './TaroContext'
import { TaroInstanceRegistry } from './TaroInstanceRegistry'

export interface TaroAppInstancesDependencies {
  logger: TaroLogger
  uiAbilityContext: common.UIAbilityContext
}

export type BuildMode = 'DEBUG' | 'RELEASE'

const TARO_BANNER = '\n\n\n' +
  '████████╗ █████╗ ██████╗  ██████╗ ' + '\n' +
  '╚══██╔══╝██╔══██╗██╔══██╗██╔═══██╗' + '\n' +
  '   ██║   ███████║██████╔╝██║   ██║' + '\n' +
  '   ██║   ██╔══██║██╔══██╗██║   ██║' + '\n' +
  '   ██║   ██║  ██║██║  ██║╚██████╔╝' + '\n' +
  '   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ' + '\n\n'

export class TaroApp {
  private logger: TaroLogger
  private rawLogger: TaroLogger
  private napiBridge: NapiBridge
  private isDebugModeEnabled: boolean
  private taroCoreContext: TaroCoreContext
  private taroInstanceRegistry: TaroInstanceRegistry

  static create(dependencies: TaroAppInstancesDependencies) {
    dependencies.logger.info(TARO_BANNER)

    const napiBridge = new NapiBridge(dependencies.logger)
    const isDebugModeEnabled = napiBridge.onInit(true).isDebugModeEnabled

    napiBridge.initializeArkTSBridge({
      getDisplayMetrics: () => {},
      handleError: (error) => {
        dependencies.logger.error(error)
      }
    })
    return new TaroApp(
      napiBridge,
      dependencies.logger,
      isDebugModeEnabled,
      dependencies.uiAbilityContext
    )
  }

  private constructor(
    napiBridge: NapiBridge,
    logger: TaroLogger,
    isDebugModeEnabled: boolean,
    uiAbilityContext: common.UIAbilityContext,
  ) {
    this.logger = logger.clone('TaroInstancesCoordinator')
    this.rawLogger = logger
    this.napiBridge = napiBridge
    this.isDebugModeEnabled = isDebugModeEnabled
    this.taroInstanceRegistry = new TaroInstanceRegistry(
      this.rawLogger,
      napiBridge,
      (taroInstance): TaroContext => TaroContext.fromCoreContext(this.taroCoreContext, taroInstance),
    )
    this.taroCoreContext = TaroCoreContext.create(
      this.rawLogger,
      uiAbilityContext,
      this.taroInstanceRegistry,
    )
  }

  public getBuildMode(): BuildMode {
    return this.isDebugModeEnabled ? 'DEBUG' : 'RELEASE'
  }

  public getTaroCoreContext() {
    return this.taroCoreContext
  }
}
