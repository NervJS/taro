import { TurboModule } from '../TurboModule'
import { Current } from '../../../current'

import type { TaroAny } from '@tarojs/runtime'

export class CurrentManagerTurboModule extends TurboModule {
  public static readonly NAME = 'CurrentManager'

  getCurrentSyncValue(value: string): TaroAny {
    return Current[value]
  }

  getCurrentAsyncValue(value: string): TaroAny {
    return Current[value]
  }
}
