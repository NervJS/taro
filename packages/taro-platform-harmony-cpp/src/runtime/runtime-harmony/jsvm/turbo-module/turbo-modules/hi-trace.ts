import hiTraceMeter from '@ohos.hiTraceMeter'

import { TurboModule } from '../TurboModule'

export class HiTraceManagerTurboModule extends TurboModule {
  public static readonly NAME = 'HiTraceManager'

  startTrace(name: string, id: number) {
    hiTraceMeter.startTrace(name, id)
  }

  finishTrace(name: string, id: number) {
    hiTraceMeter.finishTrace(name, id)
  }
}
