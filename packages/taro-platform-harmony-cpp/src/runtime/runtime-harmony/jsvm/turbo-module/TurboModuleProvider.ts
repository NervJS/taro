import { TaroLogger } from '../Logger'

import type { TurboModulesFactory } from './TaroPackage'
import type { TurboModule } from './TurboModule'

export class TurboModuleProvider {
  private cachedTurboModuleByName: Record<string, TurboModule> = {}
  private logger: TaroLogger

  constructor(private turboModulesFactories: TurboModulesFactory[], logger: TaroLogger) {
    this.logger = logger.clone('TurboModuleProvider')
  }

  getModule<T extends TurboModule>(name: string): T {
    if (!(name in this.cachedTurboModuleByName)) {
      for (const tmFactory of this.turboModulesFactories) {
        if (tmFactory.hasTurboModule(name)) {
          const module = tmFactory.createTurboModule(name)
          if (module === null) {
            throw new Error(`Couldn't create "${name}" Turbo Module`)
          } else {
            this.cachedTurboModuleByName[name] = module
          }
        }
      }
    }
    return this.cachedTurboModuleByName[name] as T
  }

  hasModule(name: string) {
    for (const tmFactory of this.turboModulesFactories) {
      if (tmFactory.hasTurboModule(name)) {
        return true
      }
    }
    return false
  }

  onDestroy() {
    Object.entries(this.cachedTurboModuleByName).forEach(([name, turboModule]) => {
      try {
        turboModule.__onDestroy__()
      } catch {
        this.logger.error('Error while cleaning up TurboModule ' + name)
      }
    })
  }
}
