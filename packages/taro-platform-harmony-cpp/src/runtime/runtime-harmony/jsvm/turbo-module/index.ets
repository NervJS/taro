import { TaroPackage, TurboModulesFactory } from './TaroPackage'
import { AlertManagerTurboModule } from './turbo-modules/alert'
import { HiTraceManagerTurboModule } from './turbo-modules/hi-trace'
import { NativePackageManagerTurboModule } from './turbo-modules/native-package'
import { UnitManagerTurboModule } from './turbo-modules/unit'
import { StorageManagerTurboModule } from './turbo-modules/storage'
import { NetworkManagerTurboModule } from './turbo-modules/network'
import { CurrentManagerTurboModule } from './turbo-modules/current'

import type { TaroAny } from '@tarojs/runtime'
import type { TurboModule, TurboModuleType, TurboModuleContext } from './TurboModule'

export class TaroCorePackage extends TaroPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new CoreTurboModulesFactory(ctx)
  }

  getDebugName() {
    return 'Taro'
  }
}

const TURBO_MODULE_CLASS_BY_NAME: Map<string, TurboModuleType> = new Map()
TURBO_MODULE_CLASS_BY_NAME.set(AlertManagerTurboModule.NAME, AlertManagerTurboModule)
TURBO_MODULE_CLASS_BY_NAME.set(NativePackageManagerTurboModule.NAME, NativePackageManagerTurboModule)
TURBO_MODULE_CLASS_BY_NAME.set(HiTraceManagerTurboModule.NAME, HiTraceManagerTurboModule)
TURBO_MODULE_CLASS_BY_NAME.set(UnitManagerTurboModule.NAME, UnitManagerTurboModule)
TURBO_MODULE_CLASS_BY_NAME.set(StorageManagerTurboModule.NAME, StorageManagerTurboModule)
TURBO_MODULE_CLASS_BY_NAME.set(NetworkManagerTurboModule.NAME, NetworkManagerTurboModule)
TURBO_MODULE_CLASS_BY_NAME.set(CurrentManagerTurboModule.NAME, CurrentManagerTurboModule)

const EAGER_TURBO_MODULE_CLASS_BY_NAME: Map<string, TurboModule> = new Map()
// EAGER_TURBO_MODULE_CLASS_BY_NAME.set(DeviceInfoTurboModule.NAME, DeviceInfoTurboModule)

class CoreTurboModulesFactory extends TurboModulesFactory {
  private eagerTurboModuleByName: Map<string, TurboModule> = new Map()

  // prepareEagerTurboModules() {
  //   // this.eagerTurboModuleByName.set(DeviceInfoTurboModule.NAME, await DeviceInfoTurboModule.create(this.ctx))
  // }

  createTurboModule(name: string): TurboModule | null {
    if (this.eagerTurboModuleByName.has(name)) {
      return this.eagerTurboModuleByName.get(name) || null
    }
    if (this.hasTurboModule(name)) {
      const TurboModuleClass: TaroAny = TURBO_MODULE_CLASS_BY_NAME.get(name)!
      return new TurboModuleClass(this.ctx)
    }
    return null
  }

  hasTurboModule(name: string): boolean {
    return (
      TURBO_MODULE_CLASS_BY_NAME.has(name) || this.eagerTurboModuleByName.has(name)
    )
  }
}
