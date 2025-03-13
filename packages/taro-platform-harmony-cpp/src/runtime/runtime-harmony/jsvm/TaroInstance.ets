import { JSBundleProvider } from './JSBundleProvider'
import { TaroLogger } from './Logger'
import { NapiBridge } from './NapiBridge'
import { TaroContext } from './TaroContext'
import { TaroCorePackage } from './turbo-module'
import { TurboModuleProvider } from './turbo-module/TurboModuleProvider'

import type { TaroObject } from '@tarojs/runtime'

export interface TaroInstance {
  getId(): number

  onDestroy(): Promise<void>

  initialize(): Promise<void>

  runJSBundle(jsBundleProvider: JSBundleProvider): Promise<void>

  runJSBundleSync(jsBundleProvider: JSBundleProvider): void
}

export interface TaroInstanceOptions {
  enableBackgroundExecutor?: boolean
}

export class TaroInstanceImpl implements TaroInstance {
  private id: number
  private injectedLogger: TaroLogger
  private napiBridge: NapiBridge
  private shouldEnableBackgroundExecutor: boolean
  private createTaroContext: (rnInstance: TaroInstance) => TaroContext
  private logger: TaroLogger
  private turboModuleProvider?: TurboModuleProvider

  constructor(
    id: number,
    injectedLogger: TaroLogger,
    napiBridge: NapiBridge,
    shouldEnableBackgroundExecutor: boolean,
    createTaroContext: (rnInstance: TaroInstance) => TaroContext,
  ) {
    this.id = id
    this.injectedLogger = injectedLogger
    this.napiBridge = napiBridge
    this.shouldEnableBackgroundExecutor = shouldEnableBackgroundExecutor
    this.createTaroContext = createTaroContext
    this.logger = injectedLogger.clone('TaroInstance')
  }

  public getId(): number {
    return this.id
  }

  public async initialize() {
    const stopTracing = this.logger.clone('initialize').startTracing()
    const processPackages = this.processPackages()
    this.turboModuleProvider = processPackages.turboModuleProvider
    this.napiBridge.createTaroInstance(
      this.id,
      this.shouldEnableBackgroundExecutor,
      this.turboModuleProvider!,
    )
    stopTracing()
  }

  private processPackages() {
    // TODO: 目前没有 packages 插入的概念，先写死
    const packages = [new TaroCorePackage({})]
    const logger = this.logger.clone('processPackages')
    const stopTracing = logger.startTracing()
    const turboModuleContext = this.createTaroContext(this)
    const result: TaroObject = {
      turboModuleProvider: new TurboModuleProvider(
        packages.map((pkg, idx) => {
          const pkgDebugName = pkg.getDebugName()
          let traceName = `package${idx + 1}`
          if (pkgDebugName) {
            traceName += `: ${pkgDebugName}`
          }
          logger.clone(traceName).debug('')
          const turboModuleFactory = pkg.createTurboModulesFactory(turboModuleContext)
          return turboModuleFactory
        }),
        this.logger
      )
    }
    stopTracing()
    return result
  }

  public async onDestroy() {
    const stopTracing = this.logger.clone('onDestroy').startTracing()

    this.napiBridge.destroyTaroInstance(this.id)

    stopTracing()
  }

  public runJSBundleSync(jsBundleProvider: JSBundleProvider) {
    const id = this.getId()
    jsBundleProvider.runSync((url, jsBundle, buffer) => {
      return this.napiBridge.loadScriptSync(id, jsBundle, buffer, url)
    })
  }

  public async runJSBundle(jsBundleProvider: JSBundleProvider) {
    const id = this.getId()
    return jsBundleProvider.run((url, jsBundle, buffer) => {
      return this.napiBridge.loadScript(id, jsBundle, buffer, url)
    })
  }
}
